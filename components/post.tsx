//TODO : server side 에서 mark 하고 highlight만 client에서 하기
"use client";
import React, { useEffect, useState } from "react";
import useHlcode from "@/hooks/useHlcode";
import { marked, Renderer } from "marked";

interface PostProps {
  name: string;
  markdown: string;
}

export default function Post({ name, markdown }: PostProps): React.JSX.Element {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useHlcode();

  useEffect(() => {
    const generateHtml = async () => {
      const renderer = new Renderer();
      renderer.image = ({
        href,
        title,
        text,
      }: {
        href: string | null;
        title: string | null;
        text: string | null;
      }): string => {
        const baseUrl = "https://dengtukgi5sf7.cloudfront.net/attachment/";
        const modifiedHref = href ? `${baseUrl}${href}` : "";
        return `<img src="${modifiedHref}" alt="${text || ""}" title="${
          title || ""
        }" />`;
      };

      // Parse the markdown with the custom renderer
      const parsedHtml = marked(markdown, { renderer });
      setHtmlContent(parsedHtml as string); // Ensure it sets the plain string result
    };

    generateHtml();
  }, [markdown]);

  return (
    <div className="bg-background">
      <h1>{name}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      />
    </div>
  );
}
