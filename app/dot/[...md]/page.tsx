import { notFound } from "next/navigation";

import Post from "@/components/post";

import { renderMarkdown } from "@/lib/markdown";
import { getMarkdownContent, listMarkdownFiles } from "@/services/aws-s3";

import Toc from "./toc";

interface PageParams {
  md: string[];
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const files = await listMarkdownFiles();

  return files.map(file => ({
    md: file.key.split("/"),
  }));
}

export default async function DotPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const slug = (await params).md;
  const filePath = decodeURIComponent(slug.join("/"));
  const fileData = await getMarkdownContent(filePath);

  if (!fileData) notFound();

  const { html, headings } = await renderMarkdown(fileData.content);

  return (
    <div className="flex w-full h-full min-h-[var(--sidebar-height)] p-[var(--padding)]">
      <div className="flex w-full lg:w-[80%] h-full px-4 lg:px-8">
        <div className="flex flex-col w-full max-w-[68ch] mx-auto pt-3.5">
          <Post
            title={fileData.title}
            html={html}
            lastModifiedDate={fileData.lastModifiedDate}
          />
        </div>
      </div>
      <div className="hidden lg:block sticky top-[var(--toc-top)] w-[20%] max-w-[240px] h-full p-8">
        <Toc headings={headings} currentPath={filePath} />
      </div>
    </div>
  );
}
