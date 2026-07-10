import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// S3 업로드 훅에서 호출하는 on-demand 재생성 엔드포인트.
//
// body: {
//   path?: "programming/web/foo.md",       // S3 키. 없으면 전체 재생성
//   event?: "update" | "create" | "delete" // 생략 시 자동 판별
// }
//
// - update: 해당 포스트 페이지만 무효화 (사이드바 구조는 그대로이므로)
// - create/delete: 사이드바가 모든 페이지에 있으므로 /dot 전체 무효화
// - event 생략(S3 Lambda 트리거처럼 create/update를 모르는 호출자):
//   create로 처리한다. S3 이벤트는 신규/덮어쓰기를 구분하지 못하고,
//   캐시된 인덱스로 판별하는 방식은 업로드 직후 인덱스가 먼저 재생성되면
//   새 글을 update로 오판하는 레이스가 있다 (사이드바 누락 버그).
//   전체 무효화는 stale-while-revalidate 덕에 방문자 체감 비용이 없다.
// - 공통: 검색 인덱스와 sitemap 갱신, 무효화 직후 해당 페이지를 미리
//   fetch해서 캐시를 데워둔다 (첫 방문자도 정적 응답을 받도록)

type RevalidateEvent = "update" | "create" | "delete";

export async function POST(request: NextRequest) {
  const secret = process.env.CCC_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "CCC_REVALIDATE_SECRET is not configured" },
      { status: 500 }
    );
  }
  if (request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const path: string | undefined = body.path;
    let event: RevalidateEvent | undefined = body.event;

    if (path && !event) {
      event = "create"; // 모르면 안전한 쪽 (전체 무효화)
    }

    const revalidated: string[] = [];

    if (path && event === "update") {
      // 포스트 내용만 바뀐 경우 - 해당 페이지만 재생성
      for (const pagePath of pagePaths(path)) {
        revalidatePath(pagePath);
        revalidated.push(pagePath);
      }
    } else {
      // 파일 추가/삭제 or 전체 요청 - 사이드바가 바뀌므로 /dot 전체 재생성
      revalidatePath("/dot", "layout");
      revalidated.push("/dot (layout)");
    }

    // 검색 인덱스와 sitemap은 항상 갱신
    revalidatePath("/api/search-index");
    revalidatePath("/sitemap.xml");

    // 캐시 프리워밍 - 다음 방문자가 MISS를 맞지 않도록 미리 재생성해둔다
    if (path && event !== "delete") {
      await prewarm(request, path);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      event: event ?? "all",
      paths: revalidated,
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

// S3 키 -> 페이지 경로. 한글 파일명은 인코딩된 URL로 접근되므로
// 인코딩/디코딩 두 형태 모두 무효화한다.
function pagePaths(s3Key: string): string[] {
  const encoded = `/dot/${s3Key.split("/").map(encodeURIComponent).join("/")}`;
  const decoded = `/dot/${s3Key}`;
  return encoded === decoded ? [encoded] : [encoded, decoded];
}

async function prewarm(request: NextRequest, s3Key: string) {
  const origin = process.env.CCC_SITE_URL ?? request.nextUrl.origin;
  const url = `${origin}/dot/${s3Key.split("/").map(encodeURIComponent).join("/")}`;

  try {
    await fetch(url, { signal: AbortSignal.timeout(10_000) });
  } catch (err) {
    // 프리워밍 실패는 치명적이지 않다 - 다음 방문자가 재생성을 트리거한다
    console.error(`Prewarm failed for ${url}:`, err);
  }
}
