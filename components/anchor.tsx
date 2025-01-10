import Link from "next/link";
import cn from "classnames";

interface AnchorProps {
  text: string;
  href: string;
  isActive: boolean;
}

export default function Anchor({ text, href, isActive }: AnchorProps) {
  const containerClass = cn(
    "flex p-2 rounded-[4px] hover:bg-primary-200 bg-transparent",
    { "text-primary-900": isActive },
    { "text-text": !isActive }
  );
  return (
    <Link href={href} className={containerClass}>
      <span className="line-clamp-1">{text}</span>
    </Link>
  );
}
