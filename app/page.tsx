import { getPostBlobData, getRawPosts } from "@/api";
import { marked } from "marked";
import Code from "./code";

export default async function Home() {
  const result = await getRawPosts();
  if (!Array.isArray(result)) return;

  const reversedPosts = result.reverse();

  const markdownContents = await Promise.all(
    reversedPosts.map(async ({ sha, name }) => {
      const content = await getPostBlobData(sha);
      const markdown = Buffer.from(content.content, "base64").toString("utf-8");
      return { name, markdown };
    })
  );

  return (
    <div>
      <div className=" w-32 h-32 bg-highlight">
        <p className=" text-lightened">fwef</p>
      </div>
      <Code></Code>

      {markdownContents.map(({ name, markdown }, index) => (
        <div className="bg-background" key={index}>
          <h1>{name}</h1>
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
