import { getFilesTitle } from "@/api";
import SideBar from "@/components/sidebar";
import { Folder } from "@/lib/types";
import React from "react";

export default async function DotLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 함수 실행
  const bucketName = "ccc-blog"; // S3 버킷 이름
  const folderPath = "programming/"; // 폴더 경로

  const result = await getFilesTitle(bucketName, folderPath);
  const fileSystem = buildFileSystem(result);

  return (
    <div className="flex flex-1 w-full">
      <SideBar directory={fileSystem} current="" />

      {children}
    </div>
  );
}
function buildFileSystem(markdownFiles: Array<string>): Folder {
  const root: Folder = {
    type: "folder",
    name: "root",
    path: "",
    subDirectories: [],
  };

  function findOrCreateFolder(
    pathSegments: string[],
    currentNode: Folder
  ): Folder {
    if (pathSegments.length === 0) return currentNode;

    const folderName = pathSegments[0];
    let folder = currentNode.subDirectories.find(
      (child) => child.type === "folder" && child.name === folderName
    ) as Folder;

    if (!folder) {
      folder = {
        type: "folder",
        name: folderName,
        // path: `${currentNode.path}/${folderName}/`,
        path: `${folderName}/`,
        subDirectories: [],
      };
      currentNode.subDirectories.push(folder);
    }

    return findOrCreateFolder(pathSegments.slice(1), folder);
  }

  markdownFiles.map((filePath) => {
    const pathSegments = filePath.split("/");
    const fileNameWithExtension = pathSegments.pop(); // Extract file name
    const fileName = fileNameWithExtension?.replace(/\.md$/, "") || ""; // Remove .md extension

    const parentFolder = findOrCreateFolder(pathSegments, root);
    parentFolder.subDirectories.push({
      type: "file",
      name: fileName,
      path: filePath,
    });
  });

  return root;
}
