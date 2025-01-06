// app/components/Post.tsx

import React from "react";

import { FileData } from "@/lib/types";
import "@/style/post.css";

interface PostProps {
  name: string;
  fileData: FileData;
}

const Post = async ({ name, fileData }: PostProps) => {
  const processedContent = fileData.content;

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
