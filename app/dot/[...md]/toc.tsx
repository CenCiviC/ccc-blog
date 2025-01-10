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

  // Extract h2 headings from HTML content - Move this outside of component render
  const h2Headings = extractHeadings(fileData.content);

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

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px 0px -90% 0px",
      threshold: [0, 0.1, 0.5, 1],
    });

    document.querySelectorAll("h2").forEach((h2) => observer.observe(h2));

    return () => observer.disconnect();
  }, []);

  return (
    <div className=" h-max fixed top-[120px]">
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

// Helper function - Move this outside of the component
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
