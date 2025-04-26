// app/components/Post.tsx

import React from "react";

import { MDData } from "@/lib/types";
import "@/style/post.css";

interface PostProps {
  name: string;
  fileData: MDData;
}

const Post = ({ name, fileData }: PostProps) => {
  const processedContent = fileData.content;
  return (
    <>
      <div className="bg-background">
        <h1>{name}</h1>
        {fileData.lastModifiedDate && (
          <p className="text-gray-500">
            마지막 수정일:{" "}
            {fileData.lastModifiedDate.toLocaleDateString("ko-KR", {
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
        <footer className="w-full h-[400px] min-h-[400px]" />
      </div>
    </>
  );
};

export default Post;
