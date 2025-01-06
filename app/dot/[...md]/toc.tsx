"use client";

import Anchor from "@/components/anchor";
import { FileData } from "@/lib/types";
import { useEffect, useState } from "react";

interface TocProps {
  fileData: FileData;
  currentPath: string;
}

export default function Toc({ fileData, currentPath }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      // 현재 보이는 모든 h2 요소들을 찾습니다
      const visibleHeadings = entries.filter((entry) => entry.isIntersecting);

      if (visibleHeadings.length > 0) {
        // 보이는 요소들 중 가장 위에 있는 요소를 찾습니다
        const topMostHeading = visibleHeadings.reduce((prev, current) => {
          return prev.boundingClientRect.top < current.boundingClientRect.top
            ? prev
            : current;
        });

        setActiveId(topMostHeading.target.id);
      }
    };

    // threshold를 여러 값으로 설정하여 더 세밀한 관찰이 가능하게 합니다
    const observer = new IntersectionObserver(callback, {
      // root를 null로 설정하여 viewport를 기준으로 관찰
      root: null,
      // 상단 여백을 0으로 설정하여 요소가 상단에 닿았을 때를 감지
      rootMargin: "0px 0px -90% 0px",
      threshold: [0, 0.1, 0.5, 1],
    });

    // 모든 h2 요소를 관찰 대상으로 등록
    document.querySelectorAll("h2").forEach((h2) => observer.observe(h2));

    return () => observer.disconnect();
  }, []);

  // Extract h2 headings from HTML content
  const h2Headings: { text: string; href: string }[] = [];
  const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g;
  let match;

  // Remove HTML tags from content to get plain text
  const getPlainText = (html: string) => {
    return html.replace(/<[^>]+>/g, "");
  };

  while ((match = regex.exec(fileData.content)) !== null) {
    h2Headings.push({
      href: match[1], // Get the id attribute
      text: getPlainText(match[2]), // Get the content between tags and remove any HTML
    });
  }

  return (
    <div className="w-full h-max sticky top-[120px]">
      {h2Headings.map((heading, index) => (
        <Anchor
          key={index}
          isActive={heading.href === activeId}
          text={heading.text}
          href={`/dot/${currentPath}#${heading.href}`}
        />
      ))}
    </div>
  );
}
