import Anchor from "@/components/anchor";
import { FileData } from "@/lib/types";

interface TocProps {
  fileData: FileData;
  currentPath: string;
}

export default function Toc({ fileData, currentPath }: TocProps) {
  // Extract h2 headings from markdown content
  const h2Headings = fileData.content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const heading = line.replace("## ", "").trim();
      return {
        text: heading,
        href: heading.replace(/\s+/g, "-"),
      };
    });

  return (
    <div className="w-full h-max sticky top-[120px]">
      {h2Headings.map((heading, index) => (
        <Anchor
          key={index}
          isActive={false}
          text={heading.text}
          href={`/dot/${currentPath}#${heading.href}`}
        />
      ))}
    </div>
  );
}
