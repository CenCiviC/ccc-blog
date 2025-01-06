// app/components/Post.tsx

import React from "react";

import { FileData } from "@/lib/types";
import "@/style/post.css";

interface PostProps {
  name: string;
  fileData: FileData;
}

const wrapPreWithCodeHeader = (html: string) => {
  return html.replace(
    /<pre([^>]*)>([\s\S]*?)<\/pre>/g,
    (match, attributes, content) => `
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
            TBD
          </span>
        </div>
        <pre${attributes} class="mt-0 rounded-t-none">${content}</pre>
      </div>
    `
  );
};

const Post = async ({ name, fileData }: PostProps) => {
  const processedContent = wrapPreWithCodeHeader(fileData.content);

  return (
    <>
      <div className="bg-background">
        <h1>{name}</h1>
        {fileData.lastModified && (
          <p className="text-gray-500">
            마지막 수정일:{" "}
            {fileData.lastModified.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              timeZone: "Asia/Seoul",
            })}
          </p>
        )}
        <div
          className="markdown-body"
          dangerouslySetInnerHTML={{
            __html: processedContent,
          }}
        />
      </div>
    </>
  );
};

export default Post;
