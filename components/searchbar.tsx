"use client";

import { useEffect, useState } from "react";

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
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-medium text-ink2 hover:text-ink transition-colors cursor-pointer"
      >
        검색
        <kbd className="text-[11px] tracking-[0.04em] text-ink2 border border-hair rounded-[5px] px-1.5 py-0.5">
          ⌘K
        </kbd>
      </button>

      {isOpen && <SearchModal setIsOpen={setIsOpen} />}
    </>
  );
}
