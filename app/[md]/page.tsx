import getMarkdownFiles from "@/api";
import Post from "@/components/post";
import SideBar from "@/components/sidebar";
import TopBar from "@/components/topbar";
import { PostType, NodeType } from "@/lib/types";

export default async function PostPage({
  params,
}: {
  params: Promise<{ md: string }>;
}) {
  // 함수 실행
  const bucketName = "ccc-blog"; // S3 버킷 이름
  const folderPath = "programming/"; // 폴더 경로
  const slug = (await params).md;

  const result = await getMarkdownFiles(bucketName, folderPath);

  const post: PostType = {
    title: "test",
    content: "content",
    createdDate: new Date(),
    modifiedDate: new Date(),
  };

  const fileSystem: NodeType = {
    type: "folder",
    name: "root",
    children: [
      {
        type: "folder",
        name: "src",
        children: [
          {
            type: "file",
            name: "index.ts",
            content: 'console.log("Hello World!");',
          },
          {
            type: "folder",
            name: "components",
            children: [
              {
                type: "file",
                name: "Button.tsx",
                content: "export const Button = () => {};",
              },
              {
                type: "file",
                name: "Input.tsx",
                content: "export const Input = () => {};",
              },
            ],
          },
        ],
      },
      {
        type: "file",
        name: "README.md",
        content: "# Project Documentation",
      },
    ],
  };

  return (
    <main className="flex flex-col w-full h-dvh">
      <TopBar />
      <div className="flex flex-1 w-full">
        <SideBar node={fileSystem} current={slug} />

        <div className="flex bg-primary-50 w-full h-full">
          <div className=" w-[75%] h-full">{slug}</div>
          <div className=" w-[25%] h-full">index content</div>
        </div>

        {/* <div className="flex flex-col">
          {post.createdDate.toUTCString()}
          {Object.entries(result)
            .reverse()
            .map(([key, markdown], index) => (
              <Post key={index} name={key} markdown={markdown} />
            ))}
        </div> */}
      </div>
    </main>
  );
}
