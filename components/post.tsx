import "@/style/post.css";

import CodeCopyListener from "./code-copy-listener";

interface PostProps {
  title: string;
  html: string; // 서버에서 변환된 마크다운 HTML
  lastModifiedDate?: Date;
}

const Post = ({ title, html, lastModifiedDate }: PostProps) => {
  return (
    <article>
      <h1 className="text-[34px] font-extrabold tracking-[-0.028em] leading-[1.28] text-ink text-balance mb-2.5">
        {title}
      </h1>
      {lastModifiedDate && (
        <p className="text-[13.5px] text-ink2 mb-[46px] pb-[22px] border-b border-hair">
          마지막 수정일 ·{" "}
          {lastModifiedDate.toLocaleDateString("ko-KR", {
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
          __html: html,
        }}
      />
      <CodeCopyListener />
      <footer className="w-full h-[400px] min-h-[400px]" />
    </article>
  );
};

export default Post;
