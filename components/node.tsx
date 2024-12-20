"use client";
import { useState } from "react";
import cn from "classnames";
import Link from "next/link";
import { FileSvg, FolderSvg } from "./icons";
import { Directory } from "@/lib/types";

interface NodeProps {
  directory: Directory;
  isOpened: boolean;
  prefix?: number;
  children?: React.ReactNode;
}

export default function Node({
  directory,
  isOpened: initialIsOpened,
  prefix = 0,
  children,
}: NodeProps) {
  const [isOpened, setIsOpened] = useState(initialIsOpened);

  const leftPadding = prefix * 10 + 8;
  const containClass = cn(
    "flex items-center gap-2.5 p-2 rounded-[4px] w-full h-10",
    { "bg-primary-900": isOpened && directory.type === "file" },
    { "hover:bg-primary-500": !(isOpened && directory.type === "file") }
  );

  const textClass = cn(" line-clamp-1 text-sm", {
    "text-primary-50": isOpened && directory.type === "file",
  });

  const handleToggle = () => {
    if (directory.type === "folder") {
      setIsOpened(!isOpened);
    }
  };

  if (directory.type === "file") {
    return (
      <Link
        style={{ paddingLeft: leftPadding }}
        href={`/dot/${directory.path}`}
        className={containClass}
      >
        <FileSvg isOpend={isOpened} />
        <span className={textClass}>{directory.name}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        style={{ paddingLeft: leftPadding }}
        className={containClass}
        onClick={handleToggle}
      >
        <FolderSvg isOpend={isOpened} />
        <span className={textClass}>{directory.name}</span>
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
