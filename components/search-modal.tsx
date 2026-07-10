"use client";

import cn from "classnames";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { searchDocuments } from "@/lib/search";
import type { SearchDocument, SearchResult, Segment } from "@/lib/search";

// 인덱스는 세션 동안 한 번만 받는다 (모달을 다시 열어도 재요청 없음)
let indexPromise: Promise<SearchDocument[]> | null = null;

function loadSearchIndex(): Promise<SearchDocument[]> {
  if (!indexPromise) {
    indexPromise = fetch("/api/search-index")
      .then(response => response.json())
      .then(data => data.documents as SearchDocument[])
      .catch(error => {
        indexPromise = null; // 실패 시 다음에 다시 시도
        throw error;
      });
  }
  return indexPromise;
}

export default function SearchModal({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const documentsRef = useRef<SearchDocument[]>([]);
  const queryRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    loadSearchIndex()
      .then(documents => {
        if (cancelled) return;
        documentsRef.current = documents;
        // 인덱스 로드 전에 입력된 검색어 반영
        if (queryRef.current) {
          setSearchResults(searchDocuments(documents, queryRef.current));
          setSelectedIndex(0);
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error("Failed to load search index:", error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchQuery = event.target.value;
    queryRef.current = searchQuery;
    setSearchResults(searchDocuments(documentsRef.current, searchQuery));
    setSelectedIndex(0);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        return;
      }
      if (searchResults.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % searchResults.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          prev => (prev - 1 + searchResults.length) % searchResults.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = searchResults[selectedIndex];
        if (selected) {
          setIsOpen(false);
          router.push(`/dot/${selected.path}`);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchResults, selectedIndex, router, setIsOpen]);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-paper/55 backdrop-blur-[7px]"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative mt-[13vh] mx-auto w-[min(620px,calc(100%-40px))] bg-paper border border-hair rounded-[10px] shadow-[0_24px_64px_color-mix(in_srgb,var(--ink)_14%,transparent)]">
        <div className="flex items-center gap-3 px-5 py-1.5 border-b border-hair">
          <input
            type="text"
            autoFocus
            name="searchQuery"
            placeholder="검색…"
            autoComplete="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent outline-none text-[19px] py-3.5 text-ink placeholder:text-ink2"
            onChange={handleChange}
          />
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setIsOpen(false)}
            className="shrink-0 text-[11px] tracking-[0.05em] text-ink2 hover:text-ink border border-hair rounded-[5px] px-1.5 py-0.5 cursor-pointer"
          >
            esc
          </button>
        </div>

        {searchResults.length > 0 ? (
          <ol className="p-2 max-h-[420px] overflow-y-auto">
            {searchResults.map((result, index) => (
              <SearchResultItem
                key={result.id}
                setIsOpen={setIsOpen}
                result={result}
                isSelected={index === selectedIndex}
              />
            ))}
          </ol>
        ) : (
          <div className="flex items-center justify-center h-[100px]">
            <span className="text-sm text-ink2">검색 결과가 없습니다</span>
          </div>
        )}

        <div className="flex gap-4 px-5 py-2.5 border-t border-hair text-xs text-ink2">
          <span>
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> 이동
          </span>
          <span>
            <Kbd>↵</Kbd> 열기
          </span>
          <span>
            <Kbd>esc</Kbd> 닫기
          </span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="text-[10.5px] border border-hair rounded px-1 py-px mr-1">
      {children}
    </kbd>
  );
}

function HighlightedText({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.match ? (
          <mark
            key={index}
            className="bg-transparent text-inherit font-[650] underline decoration-accent decoration-2 underline-offset-[3px]"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  );
}

function SearchResultItem({
  result,
  setIsOpen,
  isSelected,
}: {
  result: SearchResult;
  setIsOpen: (isOpen: boolean) => void;
  isSelected: boolean;
}) {
  const folderPath = result.path.split("/").slice(0, -1).join("/");

  return (
    <li>
      <Link
        href={`/dot/${result.path}`}
        onClick={() => setIsOpen(false)}
        className={cn(
          "flex items-baseline justify-between gap-4 px-3 py-2.5 rounded-lg",
          isSelected ? "bg-ink/[0.06]" : "hover:bg-ink/[0.06]"
        )}
      >
        <div className="flex flex-col min-w-0">
          <span className="text-[15px] text-ink line-clamp-1">
            <HighlightedText segments={result.title} />
          </span>
          <span className="text-xs text-ink2 line-clamp-1">
            <HighlightedText segments={result.snippet} />
          </span>
        </div>
        {folderPath && (
          <span className="shrink-0 text-[11px] font-semibold tracking-[0.14em] uppercase text-ink2">
            {folderPath}
          </span>
        )}
      </Link>
    </li>
  );
}
