import Link from "next/link";

export default function TopBar() {
  return (
    <nav className="flex items-center justify-between shrink-0 w-full h-[60px] px-[30px] bg-primary-300 font-semibold border-b-2 border-sub-300">
      <div className="flex items-center gap-2">
        <Link href={"./"}>symbol</Link>
        <span>CenCiviC</span>
      </div>
      <div className="flex items-center gap-3">
        <span>Github</span>
        <span>Linkedin</span>
        <span>Search</span>
      </div>
    </nav>
  );
}