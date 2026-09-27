import hljs from "highlight.js";
import { Lexer, Marked, type Tokens } from "marked";

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

// 옵시디언 콜아웃: 첫 줄 "[!type]" + 선택적 접기 표시(+/-)와 제목
const CALLOUT_HEAD = /^\[!([\w-]+)\]([+-]?)[ \t]*(.*)(?:\n|$)/;

// 옵시디언 타입(별칭 포함) → 색 그룹. 모르는 타입은 note로 본다
const CALLOUT_KIND: Record<string, string> = {
  note: "note",
  info: "note",
  todo: "note",
  tip: "tip",
  hint: "tip",
  important: "tip",
  success: "success",
  check: "success",
  done: "success",
  warning: "warning",
  caution: "warning",
  attention: "warning",
  danger: "danger",
  error: "danger",
  failure: "danger",
  fail: "danger",
  missing: "danger",
  bug: "bug",
  question: "question",
  help: "question",
  faq: "question",
  abstract: "abstract",
  summary: "abstract",
  tldr: "abstract",
  example: "abstract",
  quote: "quote",
  cite: "quote",
};

const CALLOUT_ICON: Record<string, string> = {
  note: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  tip: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>',
  success: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  warning: '<path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/>',
  danger:
    '<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><path d="M12 8v5M12 16h.01"/>',
  bug: '<rect x="7" y="7" width="10" height="13" rx="5"/><path d="M12 7V4M4 13h3M17 13h3M5 8l2 2M19 8l-2 2M5 19l2-2M19 19l-2-2"/>',
  question:
    '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.2M12 17h.01"/>',
  abstract: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  quote:
    '<path d="M6 17c-1.5 0-2.5-1-2.5-3 0-3 2-6 5-7M15 17c-1.5 0-2.5-1-2.5-3 0-3 2-6 5-7"/>',
};

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

      blockquote({ tokens }) {
        const first = tokens[0];
        const head =
          first?.type === "paragraph"
            ? CALLOUT_HEAD.exec((first as Tokens.Paragraph).text)
            : null;
        if (!head)
          return `<blockquote>${this.parser.parse(tokens)}</blockquote>`;

        const [matched, type, fold, titleText] = head;
        const kind = CALLOUT_KIND[type.toLowerCase()] ?? "note";
        const title = titleText.trim()
          ? this.parser.parseInline(Lexer.lexInline(titleText, this.options))
          : type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

        // 제목 줄을 떼어낸 첫 문단의 나머지 + 이후 블록들이 본문
        const rest = (first as Tokens.Paragraph).text.slice(matched.length);
        const body =
          (rest.trim()
            ? `<p>${this.parser.parseInline(Lexer.lexInline(rest, this.options))}</p>`
            : "") + this.parser.parse(tokens.slice(1));

        const icon = `<svg class="callout-icon" viewBox="0 0 24 24" aria-hidden="true">${CALLOUT_ICON[kind]}</svg>`;
        const titleHtml = `${icon}<span>${title}</span>`;
        const bodyHtml = body ? `<div class="callout-body">${body}</div>` : "";

        // "-"는 접힌 상태, "+"는 펼친 상태로 시작하는 접이식 콜아웃
        if (fold) {
          const open = fold === "+" ? " open" : "";
          return `<details class="callout" data-callout="${kind}"${open}><summary class="callout-title">${titleHtml}</summary>${bodyHtml}</details>`;
        }
        return `<div class="callout" data-callout="${kind}"><div class="callout-title">${titleHtml}</div>${bodyHtml}</div>`;
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
