import { getPostBlobData, getRawPosts } from "@/api";
import Post from "@/components/post";

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

      {markdownContents.map(({ name, markdown }, index) => (
        <Post key={index} name={name} markdown={markdown} />
      ))}
    </div>
  );
}
