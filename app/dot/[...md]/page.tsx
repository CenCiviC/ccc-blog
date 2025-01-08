import { fetchFileContent, getFilesTitle, getMarkdownFiles } from "@/api";
import Post from "@/components/post";
import Toc from "./toc";
import { marked } from "marked";
import hljs from "highlight.js";
interface PageParams {
  md: string[];
}

interface DotPageProps {
  params: Promise<PageParams>;
}

const BUCKET_NAME = "ccc-blog";
const FOLDER_PATH = "programming/";

export const revalidate = false;

export const dynamicParams = true; // or false, to 404 on unknown paths

export async function generateStaticParams() {
  //전체 파일 목록 가져오기
  const titles = await getFilesTitle(BUCKET_NAME, FOLDER_PATH);

  return titles.map((title) => ({
    md: String(title).split("/"),
  }));
}

export default async function DotPage({ params }: DotPageProps) {
  const slug = (await params).md;
  const filePath = decodeURIComponent(slug.join("/"));
  const fileName = filePath.split("/").pop()?.replace(/\.md$/, "") as string;
  const baseUrl = `${process.env.CCC_CDN_DOMAIN}/attachment/`;

  const fileData = await fetchFileContent(
    BUCKET_NAME,
    decodeURIComponent(filePath)
  );
  await getMarkdownFiles(BUCKET_NAME, FOLDER_PATH);

  const htmlContent = await convertMarkdownToHtml(fileData.content, baseUrl);
  fileData.content = htmlContent;

  return (
    <div className="flex bg-primary-50 w-full h-full p-[30px]">
      <div className="flex w-[75%] h-full px-8 ">
        <div className="flex flex-col w-full max-w-[820px] mx-auto">
          <Post name={fileName} fileData={fileData} />
        </div>
      </div>
      <div className=" w-[25%] h-full p-8">
        <Toc fileData={fileData} currentPath={filePath} />
      </div>
    </div>
  );
}

const convertMarkdownToHtml = async (
  content: string,
  baseUrl: string
): Promise<string> => {
  const renderer = new marked.Renderer();

  // Customize image rendering
  renderer.image = ({ href, title, text }) => {
    const imageUrl = `${baseUrl}${href}`;
    return `<img src="${imageUrl}" alt="${text}"${
      title ? ` title="${title}"` : ""
    }>`;
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

  // TODO: 코드 블럭 처리
  renderer.code = ({ lang, text }) => {
    return `<div class="relative my-4">
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
    ${lang?.toUpperCase()}
    </span>
    </div>
    <pre><code class="language-${lang} hljs">${
      hljs.highlightAuto(text).value
    }</code></pre>
    </div>`;
  };

  marked.use({ renderer });
  return marked(content);
};
