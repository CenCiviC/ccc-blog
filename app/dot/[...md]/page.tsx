import { notFound } from "next/navigation";

import type { Metadata } from "next";

import Post from "@/components/post";

import { AUTHOR_NAME, SITE_NAME, SITE_URL } from "@/lib/config";
import { encodePathSegments } from "@/lib/encoding-utils";
import { renderMarkdown } from "@/lib/markdown";
import { stripMarkdown } from "@/lib/search";
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

// 검색 결과/미리보기용 요약 - 본문 평문의 앞부분
function buildDescription(markdown: string): string {
  const plain = stripMarkdown(markdown);
  return plain.length > 160 ? `${plain.slice(0, 157)}…` : plain;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const slug = (await params).md;
  const filePath = decodeURIComponent(slug.join("/"));
  const fileData = await getMarkdownContent(filePath); // cache()로 페이지 렌더와 공유

  if (!fileData) return {};

  const description = buildDescription(fileData.content);
  const canonicalPath = `/dot/${encodePathSegments(filePath)}`;

  return {
    title: fileData.title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: fileData.title,
      description,
      url: canonicalPath,
      modifiedTime: fileData.lastModifiedDate?.toISOString(),
      locale: "ko_KR",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary",
      title: fileData.title,
      description,
    },
  };
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: fileData.title,
    description: buildDescription(fileData.content),
    inLanguage: "ko",
    dateModified: fileData.lastModifiedDate?.toISOString(),
    mainEntityOfPage: `${SITE_URL}/dot/${encodePathSegments(filePath)}`,
    author: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
  };

  return (
    <main className="flex w-full h-full min-h-[var(--sidebar-height)] p-[var(--padding)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
    </main>
  );
}
