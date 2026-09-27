"use client";

import { useEffect, useState } from "react";

import { MagnifyingGlassSvg } from "./icons";
import SearchModal, { loadSearchIndex } from "./search-modal";

// 미리 받기는 실패해도 조용히 넘긴다 (모달이 열릴 때 다시 시도)
function preloadSearchIndex() {
  loadSearchIndex().catch(() => {});
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

  // 첫 방문에도 모달을 열 때 인덱스가 준비돼 있도록 브라우저가 한가할 때 받아둔다
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(preloadSearchIndex, {
        timeout: 3000,
      });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preloadSearchIndex, 1500); // Safari 등 미지원 브라우저
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        aria-label="검색"
        onClick={() => setIsOpen(true)}
        onPointerEnter={preloadSearchIndex}
        onFocus={preloadSearchIndex}
        className="flex items-center gap-2 text-sm font-medium text-ink2 hover:text-ink transition-colors cursor-pointer"
      >
        {/* 모바일은 키보드 단축키가 없으니 아이콘만 */}
        <span className="sm:hidden p-1">
          <MagnifyingGlassSvg color="currentColor" size={17} />
        </span>
        <span className="hidden sm:inline">검색</span>
        <kbd className="hidden sm:inline text-[11px] tracking-[0.04em] text-ink2 border border-hair rounded-[5px] px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      {isOpen && <SearchModal setIsOpen={setIsOpen} />}
    </>
  );
}
