import cn from "classnames";
import Link from "next/link";

interface AnchorProps {
  text: string;
  href: string;
  isActive: boolean;
}

export default function Anchor({ text, href, isActive }: AnchorProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative block py-[5px] pl-3.5 text-[13px] leading-normal transition-colors",
        isActive ? "text-ink font-semibold" : "text-ink2 hover:text-ink"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 rounded-[1px] bg-ink" />
      )}
      <span className="line-clamp-1">{text}</span>
    </Link>
  );
}
