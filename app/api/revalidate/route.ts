import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 특정 경로만 재생성하려면 body에서 경로를 받을 수 있습니다
    const body = await request.json().catch(() => ({}));
    const path = body.path;

    if (path) {
      // 특정 경로만 재생성
      revalidatePath(path);
    } else {
      // 모든 dot 페이지 재생성
      revalidatePath("/dot", "layout");
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      path: path || "all dot pages",
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
