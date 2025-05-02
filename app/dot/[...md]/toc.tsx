"use client";

import Anchor from "@/components/anchor";
import { MDData } from "@/lib/types";
import { useEffect, useState } from "react";

interface TocProps {
  markdownData: MDData;
  currentPath: string;
}

export default function Toc({ markdownData, currentPath }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");

  const h2Headings = extractHeadings(markdownData.content);

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      const visibleHeadings = entries.filter((entry) => entry.isIntersecting);

      if (visibleHeadings.length > 0) {
        const topMostHeading = visibleHeadings.reduce((prev, current) => {
          return prev.boundingClientRect.top < current.boundingClientRect.top
            ? prev
            : current;
        });

        setActiveId(topMostHeading.target.id);
      }
    };

    const TOPBAR_MARGIN_HEIGHT_PROXIMITY = 50;
    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: `-${TOPBAR_MARGIN_HEIGHT_PROXIMITY}px 0px -70% 0px`,
      threshold: [0, 1],
    });

    document.querySelectorAll("h2").forEach((h2) => observer.observe(h2));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full h-max ">
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

// toc 생성을 위한 h2 추출함수
function extractHeadings(content: string) {
  const h2Headings: { text: string; href: string }[] = [];
  const regex = /<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/g;
  let match;

  const getPlainText = (html: string) => {
    return html.replace(/<[^>]+>/g, "");
  };

  while ((match = regex.exec(content)) !== null) {
    h2Headings.push({
      href: match[1],
      text: getPlainText(match[2]),
    });
  }

  return h2Headings;
}
