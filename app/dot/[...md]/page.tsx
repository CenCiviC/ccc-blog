import {
  getMarkdownContent,
  getMarkdownTitles,
  getAllMarkdownDatas,
} from "@/services/aws-s3";
import Post from "@/components/post";
import Toc from "./toc";
import { marked } from "marked";
import hljs from "highlight.js";
import { addDocuments, deleteAllDocuments } from "@/services/meilisearch";

interface PageParams {
  md: string[];
}

export const revalidate = 60;

export const dynamicParams = true;

export async function generateStaticParams() {
  const titles = await getMarkdownTitles();
  const documents = await getAllMarkdownDatas();
  try {
    await deleteAllDocuments();
    await addDocuments(documents);
  } catch (error) {
    console.error(error);
  }

  return titles.map((title) => ({
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
    <div className="flex bg-primary-50 w-full h-full min-h-[var(--sidebar-height)] p-[var(--padding)]">
      <div className="flex w-full lg:w-[80%] h-full px-4 lg:px-8">
        <div className="flex flex-col w-full max-w-[820px] mx-auto">
          <Post name={fileName} fileData={fileData} />
        </div>
      </div>
      <div className="hidden lg:block sticky top-[var(--toc-top)] w-[20%] h-full p-8">
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
    const imageUrl = `${baseUrl}/${href}`;
    return `<div class="flex justify-center">
      <img src="${imageUrl}" alt="${text}"${
      title ? ` title="${title}"` : ""
    } class="my-3">
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
    if (depth === 2) {
      const plainText = tokens[0].raw.replace(/<[^>]+>/g, "");
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

      return `<h2 id="${id}">${tokens[0].raw}</h2>`;
    }
    return `<h${depth}>${tokens[0].raw}</h${depth}>`;
  };

  // Customize code rendering
  renderer.code = ({ lang, text }) => {
    const highlighted = lang
      ? hljs.highlight(text, { language: lang.toLowerCase() }).value
      : hljs.highlightAuto(text).value;

    return `
    <div class="relative my-4">
      <div class="flex justify-between items-center px-3 h-[30px] bg-[#1e1e1e] rounded-t-md">
        <div class="flex gap-2">
          <div class="w-[10px] h-[10px] rounded-full bg-[#ff5f56]"></div>
          <div class="w-[10px] h-[10px] rounded-full bg-[#ffbd2e]"></div>
          <div class="w-[10px] h-[10px] rounded-full bg-[#27c93f]"></div>
        </div>
        <span
        class="text-[#6f9572] text-sm font-semibold px-2 py-1"
        data-content="${encodeURIComponent(content.trim())}"
        >
         ${lang ? lang.toUpperCase() : "CODE"}
        </span>
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
