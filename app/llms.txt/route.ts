import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/config";
import { encodePathSegments } from "@/lib/encoding-utils";
import { listMarkdownFiles } from "@/services/aws-s3";

// AI 검색/답변 엔진용 사이트 인덱스 (https://llmstxt.org 규격).
// 빌드 시 정적 생성되고 /api/revalidate에서 갱신된다.
export const dynamic = "force-static";

export async function GET() {
  const files = await listMarkdownFiles();

  // 폴더별로 그룹핑
  const groups = new Map<string, typeof files>();
  for (const file of files) {
    const folder = file.key.split("/").slice(0, -1).join("/");
    const group = groups.get(folder) ?? [];
    group.push(file);
    groups.set(folder, group);
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION} Obsidian으로 작성한 개발/학습 기록을 마크다운 원문 그대로 발행합니다.`,
    "",
    `모든 글은 한국어이며, 아래 링크는 마크다운 원문입니다. HTML 페이지는 ${SITE_URL}/dot/<경로>에 있습니다.`,
    "",
  ];

  for (const [folder, groupFiles] of groups) {
    lines.push(`## ${folder}`, "");
    for (const file of groupFiles) {
      const title = file.key.split("/").pop()?.replace(/\.md$/, "") ?? "";
      lines.push(
        `- [${title}](${SITE_URL}/raw/${encodePathSegments(file.key)})`
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
