// S3 업로드/삭제 이벤트를 받아 블로그 revalidate webhook을 호출하는 Lambda.
// Obsidian 플러그인이 S3에 동기화하면 이 함수가 자동으로 사이트에 반영한다.
//
// ── 설정 방법 (AWS 콘솔, 약 5분) ──────────────────────────────────
// 1. Lambda 콘솔 (리전: ap-northeast-2) → 함수 생성
//    - 이름: ccc-blog-revalidate / 런타임: Node.js 22.x / 아키텍처: arm64
//    - 이 파일 내용을 index.mjs에 붙여넣고 Deploy
// 2. 함수 → 구성 → 환경 변수 추가
//    - SITE_URL              = https://www.kyungbin.im
//    - REVALIDATE_SECRET     = (.env의 CCC_REVALIDATE_SECRET 값)
// 3. 함수 → 구성 → 일반 구성 → 제한 시간을 30초로 변경
//    (revalidate가 페이지 프리워밍까지 하므로 기본 3초는 부족)
// 4. S3 콘솔 → ccc-blog 버킷 → 속성 → 이벤트 알림 생성
//    - 이름: revalidate-on-md-change / 접미사: .md
//    - 이벤트 유형: "모든 객체 생성 이벤트" + "모든 객체 제거 이벤트"
//    - 대상: Lambda 함수 → ccc-blog-revalidate
//
// ⚠ 접두사(prefix) 필터에 공백이 있으면 반드시 "+"로 적어야 한다.
//    예: "side project/" (X) → "side+project/" (O)
//    문자 그대로 공백을 넣으면 에러 없이 조용히 매치가 안 된다.
//    설정 변경 후 반영까지 몇 분 걸릴 수 있다.
// ──────────────────────────────────────────────────────────────
//
// 비용: Lambda 무료 티어(월 100만 요청)로 사실상 0원

export const handler = async event => {
  const siteUrl = process.env.SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;

  for (const record of event.Records ?? []) {
    // S3 이벤트의 키는 URL 인코딩(공백은 +)되어 온다
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    if (!key.endsWith(".md")) continue;

    const isDelete = record.eventName.startsWith("ObjectRemoved");
    // S3는 신규/덮어쓰기를 구분하지 못하므로 event를 생략하면
    // webhook이 create(전체 재생성)로 안전하게 처리한다
    const body = isDelete ? { path: key, event: "delete" } : { path: key };

    const response = await fetch(`${siteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify(body),
    });

    console.log(
      `revalidate ${record.eventName} ${key} -> ${response.status}`,
      await response.text()
    );
  }

  return { statusCode: 200 };
};
