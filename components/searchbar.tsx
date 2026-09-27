"use client";

import { useEffect, useState } from "react";

import { MagnifyingGlassSvg } from "./icons";
import SearchModal from "./search-modal";

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);

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
