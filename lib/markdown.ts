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

// 메일/전화 앱으로 넘어가는 스킴 - 새 탭으로 열면 빈 탭만 남는다
const HANDOFF_SCHEME = /^(mailto|tel|sms):/i;

// 외부 웹 링크 스킴 - 이 밖의 경로는 옵시디언 상대 경로로 보고 /dot/ 밑에 붙인다
const WEB_SCHEME = /^(https?|ftps?):\/\//i;

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

        // 앵커(같은 페이지 스크롤)와 mailto/tel(앱으로 인계)은 새 탭 대상이 아니다
        if (href.startsWith("#") || HANDOFF_SCHEME.test(href)) {
          return `<a href="${href}"${titleAttr}>${text}</a>`;
        }

        // 외부 링크는 그대로, 상대 경로는 내부 문서 링크로 변환.
        // 본문 링크는 읽던 글을 잃지 않도록 둘 다 새 탭에서 연다.
        // (사이드바/목차/검색 등 UI 내비게이션은 기존대로 같은 탭)
        const isExternal = WEB_SCHEME.test(href);
        const url = isExternal ? href : `/dot/${href}`;
        const rel = isExternal ? "noopener noreferrer" : "noopener";

        return `<a href="${url}"${titleAttr} target="_blank" rel="${rel}">${text}</a>`;
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
