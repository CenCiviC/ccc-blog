import getMarkdownFiles from "@/api";
import Post from "@/components/post";
import SideBar from "@/components/sidebar";
import { PostType } from "@/lib/types";

export default async function Home() {
  // 함수 실행
  const bucketName = "ccc-blog"; // S3 버킷 이름
  const folderPath = "programming/"; // 폴더 경로

  const result = await getMarkdownFiles(bucketName, folderPath);

  const post: PostType = {
    title: "test",
    content: "content",
    createdDate: new Date(),
    modifiedDate: new Date(),
  };

  return (
    <div className=" flex ">
      <SideBar />

      <div className="flex flex-col">
        {post.createdDate.toUTCString()}
        {Object.entries(result)
          .reverse()
          .map(([key, markdown], index) => (
            <Post key={index} name={key} markdown={markdown} />
          ))}
      </div>
    </div>
  );
}
