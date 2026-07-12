"use client";

import { useEffect, useState } from "react";

import Anchor from "@/components/anchor";
import type { Heading } from "@/lib/markdown";

interface TocProps {
  headings: Heading[];
  currentPath: string;
}

export default function Toc({ headings, currentPath }: TocProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      const visibleHeadings = entries.filter(entry => entry.isIntersecting);

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

    document.querySelectorAll("h2").forEach(h2 => observer.observe(h2));

    return () => observer.disconnect();
  }, [currentPath]);

  if (headings.length === 0) return null;

  return (
    <nav className="w-full h-max" aria-label="목차">
      <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-ink2 mb-3.5">
        목차
      </p>
      {headings.map(heading => (
        <Anchor
          key={heading.id}
          isActive={heading.id === activeId}
          text={heading.text}
          href={`/dot/${currentPath}#${heading.id}`}
        />
      ))}
    </nav>
  );
}
