"use client";
import { useState } from "react";
import cn from "classnames";
import Link from "next/link";
import { FileSvg, FolderSvg } from "./icons";

interface NodeProps {
  type: "file" | "folder";
  name: string;
  isOpened: boolean;
  prefix?: number;
  children?: React.ReactNode;
}

export default function Node({
  type,
  name,
  isOpened: initialIsOpened,
  prefix = 0,
  children,
}: NodeProps) {
  const [isOpened, setIsOpened] = useState(initialIsOpened);

  const leftPadding = prefix * 10 + 8;
  const containClass = cn(
    "flex items-center gap-2.5 p-2 rounded-[4px] w-full h-10",
    { "bg-primary-900": isOpened && type === "file" },
    { "hover:bg-primary-500": !(isOpened && type === "file") }
  );

  const textClass = cn("mb-[-4px]", {
    "text-primary-50": isOpened && type === "file",
  });

  const handleToggle = () => {
    if (type === "folder") {
      setIsOpened(!isOpened);
    }
  };

  if (type === "file") {
    return (
      <Link
        style={{ paddingLeft: leftPadding }}
        href={`./${name}`}
        className={containClass}
      >
        <FileSvg isOpend={isOpened} />
        <span className={textClass}>{name}</span>
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
        <span className={textClass}>{name}</span>
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
