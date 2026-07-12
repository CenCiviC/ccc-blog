import { getMarkdownContent, listMarkdownFiles } from "@/services/aws-s3";

// 포스트의 마크다운 원문 엔드포인트 (GEO) - AI 엔진이 HTML 파싱 없이
// 깨끗한 원문을 가져갈 수 있다. /dot/<경로>와 같은 경로 규칙을 쓴다.
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  const files = await listMarkdownFiles();

  return files.map(file => ({
    md: file.key.split("/"),
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ md: string[] }> }
) {
  const slug = (await params).md;
  const filePath = decodeURIComponent(slug.join("/"));
  const fileData = await getMarkdownContent(filePath);

  if (!fileData) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(fileData.content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
