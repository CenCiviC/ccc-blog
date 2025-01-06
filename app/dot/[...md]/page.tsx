import { fetchFileContent, getMarkdownFiles } from "@/api";
import Post from "@/components/post";
import Toc from "./toc";
import { Octokit } from "octokit";

interface PageParams {
  md: string[];
}

interface DotPageProps {
  params: Promise<PageParams>;
}

const BUCKET_NAME = "ccc-blog";
const FOLDER_PATH = "programming/";

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

  const htmlContent = await convertMarkdownToHtml(fileData.content);
  const modifiedHtml = enhanceHtml(htmlContent, baseUrl);
  fileData.content = modifiedHtml;

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

const convertMarkdownToHtml = async (content: string): Promise<string> => {
  const octokit = new Octokit({
    auth: process.env.CCC_GITHUB_ACCESS_KEY ?? "",
  });

  const response = await octokit.request("POST /markdown", {
    text: content,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return response.data;
};

const enhanceHtml = (html: string, baseUrl: string): string => {
  const withImages = modifyImageUrls(html, baseUrl);
  return addIdsToH2(withImages);
};

const modifyImageUrls = (html: string, baseUrl: string): string => {
  return html.replace(
    /<img src="([^"]+)"/g,
    (_, href) => `<img src="${baseUrl}${href}"`
  );
};

const addIdsToH2 = (html: string): string => {
  return html.replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/g,
    (match, attributes, content) => {
      const plainText = content.replace(/<[^>]+>/g, "");
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

      const newAttributes = attributes
        ? `${attributes} id="${id}"`
        : ` id="${id}"`;
      return `<h2${newAttributes}>${content}</h2>`;
    }
  );
};
