import { getMarkdownTitles } from "@/services/aws-s3";
import SideBar from "@/components/sidebar";
import TopBar from "@/components/topbar";
import { Folder } from "@/lib/types";
import React from "react";

export default async function DotLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ md: string[] }>;
}>) {
  const mdTitles = await getMarkdownTitles();
  const fileSystem = buildFileSystem(
    mdTitles.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
  );

  sortFileSystem(fileSystem);

  const slug = (await params).md;
  const filePath = decodeURIComponent(slug.join("/"));

  return (
    <>
      <TopBar />
      <div className="flex flex-1 w-full h-full">
        <SideBar directory={fileSystem} currentPath={filePath} />

        {children}
      </div>
    </>
  );
}
function buildFileSystem(markdownTitles: Array<string>): Folder {
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
        path: `${folderName}/`,
        subDirectories: [],
      };
      currentNode.subDirectories.push(folder);
    }

    return findOrCreateFolder(pathSegments.slice(1), folder);
  }

  markdownTitles.map((filePath) => {
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

function sortFileSystem(node: Folder) {
  node.subDirectories.sort((a, b) => {
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  });

  for (const sub of node.subDirectories) {
    if (sub.type === "folder") {
      sortFileSystem(sub); // 재귀적으로 폴더 안도 정렬
    }
  }
}
