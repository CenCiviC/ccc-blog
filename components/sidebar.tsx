"use client";

import Node from "./node";
import { Directory } from "@/lib/types";
import { useSidebarStore } from "@/lib/store/sidebarStore";
import { useEffect } from "react";

interface SideBarProps {
  directory: Directory;
  currentPath: string;
}

const sortDirectories = (directories: Directory[]) => {
  return [...directories].sort((a, b) => {
    // 폴더를 먼저 보여주기 위해 type 비교
    if (a.type === "folder" && b.type === "file") return -1;
    if (a.type === "file" && b.type === "folder") return 1;
    // 같은 타입일 경우 이름으로 정렬
    return a.name.localeCompare(b.name, ["ko", "en"], {
      sensitivity: "variant",
    });
  });
};

const renderNode = (directory: Directory, currentPath: string) => {
  if (directory.type === "folder") {
    const isOpened =
      directory.name === "root" || currentPath.includes(directory.path);

    // 폴더 내부의 항목들도 정렬
    const sortedSubDirectories = sortDirectories(directory.subDirectories);

    return (
      <Node key={directory.name} directory={directory} isOpened={isOpened}>
        <div className="ml-4 border-l-2 border-sub-200">
          {sortedSubDirectories.map((directory) =>
            renderNode(directory, currentPath)
          )}
        </div>
      </Node>
    );
  }

  return (
    <Node
      key={directory.name}
      directory={directory}
      isOpened={directory.path === currentPath}
    />
  );
};

export default function SideBar({ directory, currentPath }: SideBarProps) {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const setIsOpen = useSidebarStore((state) => state.setIsOpen);

  useEffect(() => {
    const handleResize = () => {
      const shouldBeOpen = window.innerWidth >= 1024;
      setIsOpen(shouldBeOpen);
      if (shouldBeOpen) {
        document.body.style.overflow = "";
      }
    };

    handleResize(); // 초기 세팅
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsOpen]);

  return (
    <aside
      className={`flex flex-col sticky top-[var(--topbar-height)] shrink-0 w-[300px] h-[var(--sidebar-height)] overflow-y-scroll scroll-hide overscroll-none bg-sub-100 border-r-2 border-sub-300 p-6 gap-1 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      {renderNode(directory, currentPath)}
      <div className="w-full min-h-[100px]" />
    </aside>
  );
}
