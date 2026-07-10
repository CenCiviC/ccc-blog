# CENCIVIC BLOG REPO

> link : https://kyungbin.im

A personal blog built with Next.js that transforms Obsidian markdown notes into a web publication. Inspired by Steve Jobs' "connecting the dots" philosophy, this blog serves as a personal knowledge base where thoughts and ideas are interconnected.

## Features

- **Markdown-based**: Write posts in Obsidian and sync them to AWS S3
- **Instant publish**: `scripts/sync-obsidian.sh` syncs the vault to S3 and revalidates only the changed pages (on-demand ISR + cache prewarming)
- **Search**: Self-hosted full-text search — a static index (`/api/search-index`) is generated at build/revalidate time and searched in the browser (no search server)
- **Code highlighting**: Syntax highlighting for code blocks using highlight.js
- **Table of contents**: Auto-generated TOC for better navigation

### Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- AWS S3 (content storage)
- Marked (markdown parser)

## Publishing flow

```
Obsidian (플러그인이 S3에 자동 동기화)
  └─ S3 이벤트 알림 (.md 생성/삭제)
       └─ Lambda: scripts/lambda-s3-revalidate.mjs
            └─ POST /api/revalidate  (x-revalidate-secret 헤더 필요)
                 ├─ update        → 해당 포스트 페이지만 재생성
                 ├─ create/delete → 사이드바 포함 /dot 전체 재생성
                 │    (event 생략 시 기존 검색 인덱스 기준으로 자동 판별)
                 ├─ 검색 인덱스(/api/search-index)와 sitemap 갱신
                 └─ 재생성된 페이지를 미리 fetch해서 캐시 프리워밍
```

수동 대안: `scripts/sync-obsidian.sh` — vault를 `aws s3 sync`로 올리고
변경된 파일만 revalidate + 워밍까지 수행한다. (Lambda 설정 방법은
`scripts/lambda-s3-revalidate.mjs` 상단 주석 참고)

Required env: `CCC_REVALIDATE_SECRET`, `CCC_SITE_URL` (+ 기존 AWS/CDN 키)

## TODO

- rust markdown parser
