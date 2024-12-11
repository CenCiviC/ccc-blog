import { getPostBlobData, getRawPosts } from "@/api";
import { marked } from "marked";

export default async function Home() {
  const result = await getRawPosts();
  if (!Array.isArray(result)) return;

  const reversedPosts = result.reverse();

  // 모든 sha와 name을 가져옵니다.
  const markdownContents = await Promise.all(
    reversedPosts.map(async ({ sha, name }) => {
      const content = await getPostBlobData(sha);
      const markdown = Buffer.from(content.content, "base64").toString("utf-8");
      return { name, markdown };
    })
  );

  return (
    <div>
      {markdownContents.map(({ name, markdown }, index) => (
        <div key={index}>
          <h1>{name}</h1>
          {/* marked로 변환한 HTML을 dangerouslySetInnerHTML에 설정 */}
          <div
            dangerouslySetInnerHTML={{
              __html: marked(markdown),
            }}
          />
        </div>
      ))}
    </div>
  );
}
