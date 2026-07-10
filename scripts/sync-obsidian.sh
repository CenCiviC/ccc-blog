#!/usr/bin/env bash
# Obsidian vault를 S3로 동기화하고, 변경된 파일만 블로그에 반영한다.
#
# 사용법:
#   OBSIDIAN_VAULT_DIR=~/obsidian/vault CCC_REVALIDATE_SECRET=xxx ./scripts/sync-obsidian.sh
#
# 필요한 것: aws cli (프로필에 S3 권한), curl
#
# 동작:
#   1. 동기화 전 S3 키 목록을 저장 (create/update 구분용)
#   2. aws s3 sync로 vault의 .md 파일과 attachment/를 업로드 (--delete 포함)
#   3. 변경된 .md 파일마다 /api/revalidate 호출
#      - 기존에 있던 키  -> event=update (해당 페이지만 재생성)
#      - 새로 생긴 키    -> event=create (사이드바 포함 전체 재생성)
#      - 삭제된 키       -> event=delete

set -euo pipefail

VAULT_DIR="${OBSIDIAN_VAULT_DIR:?OBSIDIAN_VAULT_DIR 환경변수를 설정하세요 (Obsidian vault 경로)}"
SECRET="${CCC_REVALIDATE_SECRET:?CCC_REVALIDATE_SECRET 환경변수를 설정하세요}"
BUCKET="${CCC_S3_BUCKET:-ccc-blog}"
SITE_URL="${CCC_SITE_URL:-https://www.kyungbin.im}"

# 1. 동기화 전 S3 키 목록 (create/update 구분용)
existing_keys="$(mktemp)"
trap 'rm -f "$existing_keys"' EXIT
aws s3api list-objects-v2 --bucket "$BUCKET" \
  --query 'Contents[].Key' --output text 2>/dev/null | tr '\t' '\n' > "$existing_keys" || true

# 2. 동기화 (.md + 첨부파일만, 삭제 반영)
sync_output="$(
  aws s3 sync "$VAULT_DIR" "s3://$BUCKET" \
    --delete \
    --exclude "*" \
    --include "*.md" \
    --include "attachment/*" \
    --exclude ".obsidian/*" \
    --exclude ".trash/*"
)"

if [ -z "$sync_output" ]; then
  echo "변경사항 없음"
  exit 0
fi

echo "$sync_output"
echo "---"

# JSON body용 최소 이스케이프 (백슬래시, 큰따옴표)
json_escape() {
  printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'
}

revalidate() {
  local key="$1" event="$2"
  local escaped_key
  escaped_key="$(json_escape "$key")"
  echo "revalidate [$event] $key"
  curl -sS -X POST "$SITE_URL/api/revalidate" \
    -H "content-type: application/json" \
    -H "x-revalidate-secret: $SECRET" \
    -d "{\"path\":\"$escaped_key\",\"event\":\"$event\"}"
  echo

  # 무효화가 반영된 뒤 페이지를 한 번 요청해 재생성 비용을 여기서 치른다.
  # (서버 내부 프리워밍은 같은 요청 사이클이라 무효화 전 캐시를 받을 수 있음)
  if [ "$event" != "delete" ]; then
    local encoded_path
    encoded_path="$(python3 -c "
import urllib.parse, sys
print('/'.join(urllib.parse.quote(seg) for seg in sys.argv[1].split('/')))
" "$key")"
    curl -s -o /dev/null -w "warm   [%{http_code}] ${key} (%{time_total}s)\n" \
      "$SITE_URL/dot/$encoded_path"
  fi
}

# 3. sync 출력에서 변경된 .md 파일을 파싱해 revalidate 호출
#    upload: <local> to s3://<bucket>/<key>
#    delete: s3://<bucket>/<key>
while IFS= read -r line; do
  case "$line" in
    upload:*)
      key="${line#*to s3://$BUCKET/}"
      case "$key" in
        *.md)
          if grep -qxF "$key" "$existing_keys"; then
            revalidate "$key" "update"
          else
            revalidate "$key" "create"
          fi
          ;;
      esac
      ;;
    delete:*)
      key="${line#delete: s3://$BUCKET/}"
      case "$key" in
        *.md) revalidate "$key" "delete" ;;
      esac
      ;;
  esac
done <<< "$sync_output"

echo "완료"
