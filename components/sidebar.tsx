import Node from "./node";
import { Directory } from "@/lib/types";

interface SideBarProps {
  directory: Directory;
  current: string;
}

const renderNode = (directory: Directory, current: string) => {
  if (directory.type === "folder") {
    return (
      <Node key={directory.name} directory={directory} isOpened={true}>
        <div className="ml-4 border-l-2 border-sub-200">
          {directory.subDirectories.map((directory) =>
            renderNode(directory, current)
          )}
        </div>
      </Node>
    );
  }

  return (
    <Node
      key={directory.name}
      directory={directory}
      isOpened={directory.name === current}
    />
  );
};

export default function SideBar({ directory, current }: SideBarProps) {
  return (
    <nav className="flex flex-col shrink-0 w-[300px] h-full bg-sub-100 border-r-2 border-sub-300 p-6 gap-1">
      {renderNode(directory, current)}
    </nav>
  );
}
