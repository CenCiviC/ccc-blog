"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { searchDocuments } from "@/lib/search";
import type { SearchDocument, SearchResult, Segment } from "@/lib/search";

import { FileSvg, MagnifyingGlassSvg } from "./icons";

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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
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
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="flex flex-col m-auto gap-10 mt-[120px] w-[600px] min-h-[200px] max-h-[600px] bg-sub-100 rounded-lg p-5 overflow-y-scroll"
        onClick={e => e.stopPropagation()}
      >
        <form className="flex items-center gap-2.5 w-full h-[60px] px-[18px] bg-primary-50 border-2 border-sub-300 rounded-lg focus-within:border-primary-900">
          <MagnifyingGlassSvg size={28} color="var(--text-color)" />
          <input
            type="text"
            autoFocus
            name="searchQuery"
            placeholder="Search docs..."
            className="w-full h-full bg-transparent outline-none"
            onChange={handleChange}
          />
        </form>

        <div className="flex flex-col gap-2.5">
          {searchResults.length > 0 ? (
            searchResults.map(result => (
              <SearchResultItem
                key={result.id}
                setIsOpen={setIsOpen}
                result={result}
              />
            ))
          ) : (
            <div className="flex items-center justify-center h-[100px]">
              <span className="text-text text-lg">No results</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HighlightedText({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.match ? (
          <mark key={index} className="bg-primary-900 text-primary-50">
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
}: {
  result: SearchResult;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <Link
      href={`/dot/${result.path}`}
      key={result.id}
      onClick={() => setIsOpen(false)}
      className="flex items-center justify-between h-[60px] bg-primary-50 group hover:bg-primary-900 rounded-lg p-4 gap-2.5"
    >
      <div className="flex items-center gap-2.5">
        <FileSvg
          isOpend={true}
          size={28}
          className="group-hover:block hidden"
        />
        <FileSvg
          isOpend={false}
          size={28}
          className="group-hover:hidden block"
        />
        <div className="flex flex-col">
          <span className="group-hover:text-primary-50 text-text text-base font-medium line-clamp-1">
            <HighlightedText segments={result.title} />
          </span>
          <span className="group-hover:text-primary-50 text-text text-xs line-clamp-1">
            <HighlightedText segments={result.snippet} />
          </span>
        </div>
      </div>
    </Link>
  );
}
