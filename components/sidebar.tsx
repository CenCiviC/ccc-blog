import Node from "./node";
import { NodeType } from "@/lib/types";

interface SideBarProps {
  node: NodeType;
  current: string;
}

const renderNode = (node: NodeType, current: string) => {
  if (node.type === "folder") {
    return (
      <Node key={node.name} name={node.name} type={node.type} isOpened={true}>
        <div className="ml-4 border-l-2 border-sub-200">
          {node.children.map((child) => renderNode(child, current))}
        </div>
      </Node>
    );
  }

  return (
    <Node
      key={node.name}
      name={node.name}
      type={node.type}
      isOpened={node.name === current}
    />
  );
};

export default function SideBar({ node, current }: SideBarProps) {
  return (
    <nav className="flex flex-col shrink-0 w-[300px] h-full bg-sub-100 border-r-2 border-sub-300 p-6 gap-1">
      {renderNode(node, current)}
    </nav>
  );
}
