import type React from "react";

import SideBar from "@/components/sidebar";
import TopBar from "@/components/topbar";
import { buildFileTree } from "@/lib/file-tree";
import { listMarkdownFiles } from "@/services/aws-s3";

export default async function DotLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ md: string[] }>;
}>) {
  const files = await listMarkdownFiles();
  const fileTree = buildFileTree(files.map(file => file.key));

  const slug = (await params).md;
  const filePath = decodeURIComponent(slug.join("/"));

  return (
    <>
      <TopBar />
      <div className="flex flex-1 w-full h-full">
        <SideBar directory={fileTree} currentPath={filePath} />

        {children}
      </div>
    </>
  );
}
