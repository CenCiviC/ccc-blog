"use client";

import Node from "./node";
import { Directory } from "@/lib/types";
import { useSidebarStore } from "@/lib/store/sidebarStore";

interface SideBarProps {
  directory: Directory;
  currentPath: string;
}

const renderNode = (directory: Directory, currentPath: string) => {
  if (directory.type === "folder") {
    const isOpened =
      directory.name === "root" || currentPath.includes(directory.path);
    return (
      <Node key={directory.name} directory={directory} isOpened={isOpened}>
        <div className="ml-4 border-l-2 border-sub-200">
          {directory.subDirectories.map((directory) =>
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

  return (
    <aside
      className={`flex flex-col sticky top-[var(--topbar-height)] shrink-0 w-[300px] h-[var(--sidebar-height)] overflow-y-scroll scroll-hide overscroll-none bg-sub-100 border-r-2 border-sub-300 p-6 gap-1 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      {renderNode(directory, currentPath)}

      {/* 여유공간 */}
      <div className="w-full min-h-[100px]" />
    </aside>
  );
}
