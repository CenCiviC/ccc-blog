// app/components/Post.tsx

import React from "react";
import { Octokit } from "octokit";
import { FileData } from "@/lib/types";
import "@/style/post.css";

interface PostProps {
  name: string;
  fileData: FileData;
}

const Post = async ({ name, fileData }: PostProps) => {
  const baseUrl = `${process.env.CCC_CDN_DOMAIN}/attachment/`;

  const modifyImageUrls = (html: string): string => {
    return html.replace(
      /<img src="([^"]+)"/g,
      (_, href) => `<img src="${baseUrl}${href}"`
    );
  };
  const addIdsToH2 = (html: string): string => {
    return html.replace(
      /<h2([^>]*)>([\s\S]*?)<\/h2>/g,
      (match, attributes, content) => {
        // HTML 태그 제거
        const plainText = content.replace(/<[^>]+>/g, "");

        // 한글, 영문, 특수문자 모두 처리
        const id = plainText
          .trim()
          .split("")
          .map((char: string) => {
            // 한글인 경우 그대로 유지
            if (/[\u3131-\uD79D]/.test(char)) {
              return char;
            }
            // 특수문자는 그대로 유지
            if (/[!@#$%^&*(),.?":{}|<>]/.test(char)) {
              return char;
            }
            // 영문, 숫자, 공백은 기존 방식대로 처리
            return char.toLowerCase();
          })
          .join("")
          .replace(/\s+/g, "-"); // 공백만 하이픈으로 변경

        // 기존 속성이 있으면 그대로 유지하고 id 추가
        const newAttributes = attributes
          ? `${attributes} id="${id}"`
          : ` id="${id}"`;
        return `<h2${newAttributes}>${content}</h2>`;
      }
    );
  };

  const octokit = new Octokit({
    auth: process.env.CCC_GITHUB_ACCESS_KEY ?? "",
  });

  const data = await octokit.request("POST /markdown", {
    text: fileData.content,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const modifiedHtml = addIdsToH2(modifyImageUrls(data.data));

  return (
    <div className="bg-background ">
      <h1>{name}</h1>
      {fileData.lastModified && (
        <p className="text-gray-500">
          Last modified: {fileData.lastModified.toLocaleDateString()}
        </p>
      )}
      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{
          __html: modifiedHtml,
        }}
      />
    </div>
  );
};

export default Post;
