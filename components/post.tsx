// app/components/Post.tsx
import React from "react";
import { Octokit } from "octokit";

interface PostProps {
  name: string;
  markdown: string;
}

const Post = async ({ name, markdown }: PostProps) => {
  const baseUrl = `${process.env.CCC_CDN_DOMAIN}/attachment/`;

  const modifyImageUrls = (html: string): string => {
    return html.replace(
      /<img src="([^"]+)"/g,
      (_, href) => `<img src="${baseUrl}${href}"`
    );
  };

  const octokit = new Octokit({
    auth: process.env.CCC_GITHUB_ACCESS_KEY ?? "",
  });

  const data = await octokit.request("POST /markdown", {
    text: markdown,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const modifiedHtml = modifyImageUrls(data.data);

  return (
    <div className="bg-background ">
      <h1>{name}</h1>
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
