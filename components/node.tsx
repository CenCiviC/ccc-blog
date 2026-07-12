"use client";

import cn from "classnames";

import Link from "next/link";
import { useState } from "react";

import type { Directory } from "@/lib/types";

import { ChevronRightSvg, FileSvg, FolderSvg } from "./icons";

interface NodeProps {
  directory: Directory;
  isOpened: boolean;
  children?: React.ReactNode;
}

const rowClass =
  "flex items-center gap-2 w-full h-8 px-2.5 my-0.5 rounded-lg text-sm whitespace-nowrap transition-colors";

export default function Node({
  directory,
  isOpened: initialIsOpened,
  children,
}: NodeProps) {
  const [isOpened, setIsOpened] = useState(initialIsOpened);

  if (directory.type === "file") {
    const isActive = initialIsOpened;
    return (
      <Link
        href={`/dot/${directory.path}`}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          rowClass,
          isActive
            ? "bg-ink text-paper font-semibold"
            : "text-ink2 hover:text-ink hover:bg-ink/[0.07]"
        )}
      >
        <FileSvg className={isActive ? "text-paper/75" : "text-ink/60"} />
        <span className="truncate leading-normal">{directory.name}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpened}
        className={cn(
          rowClass,
          "font-semibold text-ink hover:bg-ink/[0.07] cursor-pointer"
        )}
        onClick={() => setIsOpened(!isOpened)}
      >
        <ChevronRightSvg
          className={cn("text-ink2 transition-transform duration-200", {
            "rotate-90": isOpened,
          })}
        />
        <span className="text-ink/60">
          <FolderSvg />
        </span>
        <span className="truncate leading-normal">{directory.name}</span>
      </button>
      <div
        className={cn("overflow-hidden transition-all ease-in-out", {
          "max-h-0": !isOpened,
          "max-h-[10000px]": isOpened,
        })}
        style={{ transitionDuration: "300ms" }}
      >
        {children}
      </div>
    </div>
  );
}
