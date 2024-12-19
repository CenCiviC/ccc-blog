import getMarkdownFiles from "@/api";
import SideBar from "@/components/sidebar";
import TopBar from "@/components/topbar";
import { PostType, FolderNode } from "@/lib/types";
import Post from "@/components/post";

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

  const fileSystem = buildFileSystem(result);
  return (
    <main className="flex flex-col w-full h-dvh">
      <TopBar />
      <div className="flex flex-1 w-full">
        <SideBar node={fileSystem} current="" />

        <div className="flex bg-primary-50 w-full h-full">
          <div className=" w-[75%] h-full">
            <div className="flex flex-col">
              {post.createdDate.toUTCString()}
              {Object.entries(result)
                .reverse()
                .slice(3, 5)
                .map(([key, markdown], index) => (
                  <Post key={index} name={key} markdown={markdown} />
                ))}
            </div>
          </div>
          <div className=" w-[25%] h-full">index content</div>
        </div>
      </div>
    </main>
  );
}

function buildFileSystem(markdownFiles: Record<string, string>): FolderNode {
  const root: FolderNode = { type: "folder", name: "root", children: [] };

  function findOrCreateFolder(
    pathSegments: string[],
    currentNode: FolderNode
  ): FolderNode {
    if (pathSegments.length === 0) return currentNode;

    const folderName = pathSegments[0];
    let folder = currentNode.children.find(
      (child) => child.type === "folder" && child.name === folderName
    ) as FolderNode;

    if (!folder) {
      folder = { type: "folder", name: folderName, children: [] };
      currentNode.children.push(folder);
    }

    return findOrCreateFolder(pathSegments.slice(1), folder);
  }

  Object.entries(markdownFiles).forEach(([filePath, content]) => {
    const pathSegments = filePath.split("/");
    const fileNameWithExtension = pathSegments.pop(); // Extract file name
    const fileName = fileNameWithExtension?.replace(/\.md$/, "") || ""; // Remove .md extension

    const parentFolder = findOrCreateFolder(pathSegments, root);
    parentFolder.children.push({
      type: "file",
      name: fileName,
      content,
    });
  });

  return root;
}
