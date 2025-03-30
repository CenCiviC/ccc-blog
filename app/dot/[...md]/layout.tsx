import { getMarkdownTitles } from "@/api/aws-s3";
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
  const fileSystem = buildFileSystem(mdTitles);

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
