"use client";

import { searchDocuments } from "@/api/meilisearch";
import { FileSvg, MagnifyingGlassSvg } from "./icons";
import { useState } from "react";
import Link from "next/link";
import { MDData } from "@/lib/types";

interface SearchResult extends MDData {
  _formatted: MDData;
}

export default function SearchModal({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const searchQuery = event.target.value;
    const results = await searchDocuments(searchQuery);
    setSearchResults(results.hits as SearchResult[]);
    //console.log(results.hits as SearchResult[]);
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="flex flex-col m-auto gap-10 mt-[120px] w-[600px] min-h-[200px] max-h-[600px] bg-sub-100 rounded-lg p-5 overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
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
            searchResults.map((result) => (
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
        <div key={result.id} className="flex flex-col">
          <span
            dangerouslySetInnerHTML={{
              __html: result._formatted.title.replace(
                /<mark>/g,
                '<mark class="bg-primary-900 text-primary-50">'
              ),
            }}
            className="group-hover:text-primary-50 text-text text-base font-medium line-clamp-1"
          ></span>
          <span
            dangerouslySetInnerHTML={{
              __html: result._formatted.content.replace(
                /<mark>/g,
                '<mark class="bg-primary-900 text-primary-50">'
              ),
            }}
            className="group-hover:text-primary-50 text-text text-xs line-clamp-1"
          ></span>
        </div>
      </div>
    </Link>
  );
}
