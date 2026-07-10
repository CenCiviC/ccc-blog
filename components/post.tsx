// app/components/Post.tsx

import type { MDData } from "@/lib/types";
import "@/style/post.css";

import CodeCopyListener from "./code-copy-listener";

interface PostProps {
  name: string;
  fileData: MDData;
}

const Post = ({ name, fileData }: PostProps) => {
  const processedContent = fileData.content;
  return (
    <article>
      <h1 className="text-[34px] font-extrabold tracking-[-0.028em] leading-[1.28] text-ink text-balance mb-2.5">
        {name}
      </h1>
      {fileData.lastModifiedDate && (
        <p className="text-[13.5px] text-ink2 mb-[46px] pb-[22px] border-b border-hair">
          마지막 수정일 ·{" "}
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
      <CodeCopyListener />
      <footer className="w-full h-[400px] min-h-[400px]" />
    </article>
  );
};

export default Post;
