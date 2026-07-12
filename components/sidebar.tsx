"use client";

import { useEffect, useRef } from "react";

import { useSidebarStore } from "@/lib/store/sidebarStore";
import type { Directory } from "@/lib/types";

import Node from "./node";

interface SideBarProps {
  directory: Directory;
  currentPath: string;
}

// 트리는 서버(buildFileTree)에서 이미 정렬된 상태로 내려온다
const renderNode = (
  directory: Directory,
  currentPath: string
): React.ReactNode => {
  if (directory.type === "folder") {
    // 루트 폴더는 행 없이 자식만 렌더링
    if (directory.name === "root") {
      return directory.subDirectories.map(sub => renderNode(sub, currentPath));
    }

    // 폴더 path는 상위 경로를 포함한 전체 경로라 prefix 비교로 열림 판정
    const isOpened = currentPath.startsWith(directory.path);

    return (
      <Node key={directory.name} directory={directory} isOpened={isOpened}>
        <div className="ml-[15px] pl-[7px] border-l border-hair">
          {directory.subDirectories.map(directory =>
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
  const asideRef = useRef<HTMLElement>(null);

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

  // 현재 파일이 보이도록 사이드바 내부만 스크롤한다.
  // 이미 보이면 움직이지 않고, 벗어나 있으면 위에서 1/3 지점에 둔다.
  // (경로 변경 또는 모바일 드로어 열림 시에만 실행 — 사용자 스크롤을 방해하지 않음)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const aside = asideRef.current;
      if (!aside || aside.clientHeight === 0) return; // 숨겨져 있으면 건너뜀

      const row = aside.querySelector<HTMLElement>('a[aria-current="page"]');
      if (!row) return;

      const asideRect = aside.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const relTop = rowRect.top - asideRect.top;

      // 이미 사이드바 안에 온전히 보이면 그대로 둔다
      const alreadyVisible =
        relTop >= 0 && relTop + rowRect.height <= aside.clientHeight;
      if (alreadyVisible) return;

      const rowOffset = aside.scrollTop + relTop; // 스크롤 콘텐츠 기준 행 위치
      const target = rowOffset - aside.clientHeight / 3;
      const maxScroll = aside.scrollHeight - aside.clientHeight;
      aside.scrollTop = Math.max(0, Math.min(target, maxScroll));
    });

    return () => cancelAnimationFrame(raf);
  }, [currentPath, isOpen]);

  return (
    <aside
      ref={asideRef}
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
