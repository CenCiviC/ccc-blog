"use client";

import { useEffect } from "react";

/**
 * 마크다운으로 렌더된 코드블록의 "복사" 버튼에 클릭 위임 핸들러를 붙인다.
 * 렌더된 HTML은 dangerouslySetInnerHTML로 삽입되므로 React 이벤트를 쓸 수 없다.
 */
export default function CodeCopyListener() {
  useEffect(() => {
    const handler = async (e: MouseEvent) => {
      const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
        ".codeblock-copy"
      );
      if (!button) return;

      const code =
        button.closest(".codeblock")?.querySelector("pre code")?.textContent ??
        "";

      try {
        await navigator.clipboard.writeText(code);
        const label = button.textContent;
        button.textContent = "복사됨";
        setTimeout(() => {
          button.textContent = label;
        }, 1500);
      } catch {
        // clipboard 미지원 환경에서는 조용히 무시
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
