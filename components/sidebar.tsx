"use client";

import { useEffect } from "react";

import { useSidebarStore } from "@/lib/store/sidebarStore";
import type { Directory } from "@/lib/types";

import Node from "./node";

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

const renderNode = (
  directory: Directory,
  currentPath: string
): React.ReactNode => {
  if (directory.type === "folder") {
    // 루트 폴더는 행 없이 자식만 렌더링
    if (directory.name === "root") {
      return sortDirectories(directory.subDirectories).map(sub =>
        renderNode(sub, currentPath)
      );
    }

    const isOpened = currentPath.includes(directory.path);

    // 폴더 내부의 항목들도 정렬
    const sortedSubDirectories = sortDirectories(directory.subDirectories);

    return (
      <Node key={directory.name} directory={directory} isOpened={isOpened}>
        <div className="ml-[15px] pl-[7px] border-l border-hair">
          {sortedSubDirectories.map(directory =>
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
  const isOpen = useSidebarStore(state => state.isOpen);
  const setIsOpen = useSidebarStore(state => state.setIsOpen);

  useEffect(() => {
    // 데스크톱 폭으로 넘어가면 모바일 드로어 상태를 정리한다
    // (표시 자체는 CSS의 lg:flex가 담당)
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsOpen]);

  return (
    <aside
      aria-label="문서 탐색"
      className={`flex-col fixed lg:sticky top-[var(--topbar-height)] z-40 lg:z-auto shrink-0 w-[280px] h-[var(--sidebar-height)] overflow-y-scroll overscroll-none bg-paper border-r border-hair py-8 pl-6 pr-4 ${
        isOpen ? "flex" : "hidden lg:flex"
      }`}
    >
      <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-ink2 mb-3.5 ml-1.5">
        Dots
      </p>
      {renderNode(directory, currentPath)}
      <div className="w-full min-h-[100px]" />
    </aside>
  );
}
