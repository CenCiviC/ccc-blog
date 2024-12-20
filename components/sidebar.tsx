import Node from "./node";
import { Directory } from "@/lib/types";

interface SideBarProps {
  directory: Directory;
  currentPath: string;
}

const renderNode = (directory: Directory, currentPath: string) => {
  if (directory.type === "folder") {
    return (
      <Node key={directory.name} directory={directory} isOpened={true}>
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
  return (
    <nav className="flex flex-col shrink-0 w-[300px] h-full bg-sub-100 border-r-2 border-sub-300 p-6 gap-1">
      {renderNode(directory, currentPath)}
    </nav>
  );
}
