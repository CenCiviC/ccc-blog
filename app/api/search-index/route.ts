import { NextResponse } from "next/server";

import { stripMarkdown } from "@/lib/search";
import type { SearchDocument } from "@/lib/search";
import { getAllMarkdownDatas } from "@/services/aws-s3";

// 빌드 시 정적 생성되고, /api/revalidate에서 revalidatePath로 갱신된다.
// 클라이언트는 이 JSON을 한 번 받아 브라우저에서 검색한다.
export const dynamic = "force-static";

export async function GET() {
  const markdownDatas = await getAllMarkdownDatas();

  const documents: SearchDocument[] = markdownDatas
    .filter(data => data.path)
    .map(data => ({
      id: data.id,
      path: data.path,
      title: data.title,
      content: stripMarkdown(data.content),
    }));

  return NextResponse.json({ documents });
}
