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
        setIsOpen(true);
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
        className="flex w-fit h-fit items-center gap-2 px-2.5 py-1.5 bg-primary-50 rounded-full group border-2 border-transparent hover:border-primary-900 cursor-pointer"
      >
        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100">
          <MagnifyingGlassSvg size={20} color="var(--text-color)" />
          <span className="hidden lg:inline text-text">Search</span>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <kbd className="flex items-center justify-center w-5 h-[18px] rounded-[3px] bg-gradient-to-tr from-[#F8F8F8] to-[#D5DBE4] [box-shadow:inset_0_-2px_#CDCDE6,inset_0_0_1px_1px_#FFFFFF,0_1px_2px_1px_#1E235A66]">
            <span className="text-text text-xs font-medium">⌘</span>
          </kbd>

          <kbd className="flex items-center justify-center w-5 h-[18px] rounded-[3px] bg-gradient-to-tr from-[#F8F8F8] to-[#D5DBE4] [box-shadow:inset_0_-2px_#CDCDE6,inset_0_0_1px_1px_#FFFFFF,0_1px_2px_1px_#1E235A66]">
            <span className="text-text text-xs font-medium">K</span>
          </kbd>
        </div>
      </button>

      {isOpen && <SearchModal setIsOpen={setIsOpen} />}
    </>
  );
}
