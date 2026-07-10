import hljs from "highlight.js";
import { marked } from "marked";

import Post from "@/components/post";

import { getMarkdownContent, getMarkdownTitles } from "@/services/aws-s3";

import Toc from "./toc";

interface PageParams {
  md: string[];
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const titles = await getMarkdownTitles();

  return titles.map(title => ({
    md: String(title).split("/"),
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

  const fileName = filePath.split("/").pop()?.replace(/\.md$/, "") as string;

  const htmlContent = await convertMarkdownToHtml(fileData.content);
  fileData.content = htmlContent;

  return (
    <div className="flex w-full h-full min-h-[var(--sidebar-height)] p-[var(--padding)]">
      <div className="flex w-full lg:w-[80%] h-full px-4 lg:px-8">
        <div className="flex flex-col w-full max-w-[68ch] mx-auto pt-3.5">
          <Post name={fileName} fileData={fileData} />
        </div>
      </div>
      <div className="hidden lg:block sticky top-[var(--toc-top)] w-[20%] max-w-[240px] h-full p-8">
        <Toc markdownData={fileData} currentPath={filePath} />
      </div>
    </div>
  );
}

const convertMarkdownToHtml = async (content: string): Promise<string> => {
  const renderer = new marked.Renderer();

  // Customize image rendering
  renderer.image = ({ href, title, text }) => {
    const baseUrl = `${process.env.CCC_CDN_IMAGE_DOMAIN}`;
    // href가 "attachment"로 시작하면 제거
    const processedHref = href?.startsWith("attachment/")
      ? href.replace(/^attachment\//, "")
      : href;
    const mediaUrl = `${baseUrl}/${processedHref}`;

    // 비디오 확장자 확인
    // NOTE: 비디오가 적혀도 marked에서 image로 처리됨
    const videoExtensions = [
      ".mov",
      ".mp4",
      ".webm",
      ".ogg",
      ".ogv",
      ".avi",
      ".mkv",
    ];
    const isVideo =
      processedHref &&
      videoExtensions.some(ext => processedHref.toLowerCase().endsWith(ext));

    if (isVideo) {
      return `<div class="md-media">
        <video src="${mediaUrl}" controls${title ? ` title="${title}"` : ""}>
          Your browser does not support the video tag.
        </video>
      </div>`;
    }

    return `<div class="md-media">
      <img src="${mediaUrl}" alt="${text}"${title ? ` title="${title}"` : ""}>
    </div>`;
  };

  // Customize link rendering to use absolute paths
  renderer.link = ({ href, title, text }) => {
    if (!href) return text;

    if (href.startsWith("#")) {
      // If it's an anchor link, keep it as is
      return `<a href="${href}"${title ? ` title="${title}"` : ""}>${text}</a>`;
    }

    if (href.startsWith("http")) {
      // If it already has http/https, keep as is
      return `<a href="${href}"${title ? ` title="${title}"` : ""}>${text}</a>`;
    }

    // Add domain for relative paths
    const absoluteHref = `https://www.kyungbin.im/dot/${href}`;
    return `<a href="${absoluteHref}"${
      title ? ` title="${title}"` : ""
    }>${text}</a>`;
  };

  // Customize h2 rendering
  renderer.heading = ({ tokens, depth }) => {
    // 내용 없는 헤딩("## ")은 tokens가 비어있어 빌드를 깨뜨린다
    const raw = tokens[0]?.raw ?? "";
    if (depth === 2) {
      const plainText = raw.replace(/<[^>]+>/g, "");
      const id = plainText
        .trim()
        .split("")
        .map((char: string) => {
          if (/[\u3131-\uD79D]/.test(char)) return char;
          if (/[!@#$%^&*(),.?":{}|<>]/.test(char)) return char;
          return char.toLowerCase();
        })
        .join("")
        .replace(/\s+/g, "-");

      return `<h2 id="${id}">${raw}</h2>`;
    }
    return `<h${depth}>${raw}</h${depth}>`;
  };

  // Customize code rendering
  renderer.code = ({ lang, text }) => {
    let highlighted = "";
    try {
      highlighted = lang
        ? hljs.highlight(text, { language: lang.toLowerCase() }).value
        : hljs.highlightAuto(text).value;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error highlighting code: ${lang}`, error);
    }

    return `
    <div class="codeblock">
      <div class="codeblock-bar">
        <span class="codeblock-lang">${lang || "code"}</span>
        <button type="button" class="codeblock-copy">복사</button>
      </div>
      <pre><code class="language-${
        lang || "plaintext"
      } hljs">${highlighted}</code></pre>
    </div>`;
  };

  marked.setOptions({ gfm: true, breaks: true });
  marked.use({ renderer });
  return marked(content);
};
