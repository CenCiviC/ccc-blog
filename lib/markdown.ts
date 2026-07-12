import hljs from "highlight.js";
import { Marked } from "marked";

import { requireEnv } from "@/lib/env";

export type Heading = {
  id: string; // h2에 부여되는 anchor id
  text: string; // 태그가 제거된 평문
};

export type RenderedMarkdown = {
  html: string;
  headings: Heading[]; // 목차용 h2 목록 (문서 순서)
};

// 비디오가 마크다운 이미지 문법으로 적혀도 marked에서는 image로 처리된다
const VIDEO_EXTENSIONS = [
  ".mov",
  ".mp4",
  ".webm",
  ".ogg",
  ".ogv",
  ".avi",
  ".mkv",
];

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 마크다운을 HTML로 변환하면서 목차용 h2 목록을 함께 추출한다.
// 헤딩 id 생성 규칙과 소비(목차)가 한 곳에서 관리되도록 여기서만 정의한다.
export async function renderMarkdown(
  markdown: string
): Promise<RenderedMarkdown> {
  const cdnBaseUrl = requireEnv("CCC_CDN_IMAGE_DOMAIN");
  const headings: Heading[] = [];

  const marked = new Marked({ gfm: true, breaks: true });

  marked.use({
    renderer: {
      image({ href, title, text }) {
        // href가 "attachment"로 시작하면 제거 (CDN 베이스에 이미 포함)
        const processedHref = href?.startsWith("attachment/")
          ? href.replace(/^attachment\//, "")
          : href;
        const mediaUrl = `${cdnBaseUrl}/${processedHref}`;
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";

        const isVideo =
          processedHref &&
          VIDEO_EXTENSIONS.some(ext =>
            processedHref.toLowerCase().endsWith(ext)
          );

        if (isVideo) {
          return `<div class="md-media">
        <video src="${mediaUrl}" controls${titleAttr}>
          Your browser does not support the video tag.
        </video>
      </div>`;
        }

        return `<div class="md-media">
      <img src="${mediaUrl}" alt="${escapeAttr(text)}"${titleAttr}>
    </div>`;
      },

      link({ href, title, text }) {
        if (!href) return text;
        const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";

        // anchor/외부 링크는 그대로, 상대 경로는 내부 문서 링크로 변환
        if (href.startsWith("#") || href.startsWith("http")) {
          return `<a href="${href}"${titleAttr}>${text}</a>`;
        }
        return `<a href="/dot/${href}"${titleAttr}>${text}</a>`;
      },

      heading({ tokens, depth }) {
        // 내용 없는 헤딩("## ")은 tokens가 비어있어 빌드를 깨뜨린다
        const raw = tokens.map(token => token.raw).join("");
        if (depth === 2) {
          const plainText = raw.replace(/<[^>]+>/g, "").trim();
          const id = plainText.toLowerCase().replace(/\s+/g, "-");
          headings.push({ id, text: plainText });
          return `<h2 id="${id}">${raw}</h2>`;
        }
        return `<h${depth}>${raw}</h${depth}>`;
      },

      code({ lang, text }) {
        let highlighted = "";
        try {
          highlighted = lang
            ? hljs.highlight(text, { language: lang.toLowerCase() }).value
            : hljs.highlightAuto(text).value;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error highlighting code: ${lang}`, error);
        }

        return `
    <div class="codeblock">
      <div class="codeblock-bar">
        <span class="codeblock-lang">${lang || "code"}</span>
        <button type="button" class="codeblock-copy">복사</button>
      </div>
      <pre><code class="language-${
        lang || "plaintext"
      } hljs">${highlighted}</code></pre>
    </div>`;
      },
    },
  });

  const html = await marked.parse(markdown);
  return { html, headings };
}
