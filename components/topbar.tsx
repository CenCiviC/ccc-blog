import Image from "next/image";
import Link from "next/link";
import { DotsSvg, MenuSvg, QuestionMarkSvg } from "./icons";
import SearchBar from "./searchbar";

export default function TopBar() {
  return (
    <nav className="flex sticky z-50 top-0 left-0 items-center justify-between shrink-0 w-full h-[var(--topbar-height)] px-[30px] bg-primary-300 font-semibold border-b-2 border-sub-300">
      <div className="flex items-center gap-2">
        {/* mobile side button */}
        <button className="lg:hidden">
          <MenuSvg />
        </button>

        <Link
          href={"/dot/programming/docker/Docker%20관련%20명령어.md"}
          className="hidden lg:block hover:text-primary-900 group"
        >
          <div className="flex items-center rounded-md hover:bg-primary-500 px-2 py-1 gap-1.5">
            <QuestionMarkSvg color="var(--text-color)" />
            <span className="text-text">Who am i?</span>
          </div>
        </Link>
        <Link
          href={"/dot/programming/docker/Docker%20관련%20명령어.md"}
          className="hidden lg:block hover:text-primary-900 group"
        >
          <div className="flex items-center rounded-md hover:bg-primary-500 px-2 py-1 gap-1.5">
            <DotsSvg color="var(--text-color)" />
            <span className="text-text">Dots</span>
          </div>
        </Link>
      </div>
      <Link
        href={"/"}
        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 group"
      >
        <Image
          src="/img/logo-black.png"
          alt="logo"
          width={48}
          height={40}
          className="object-contain group-hover:hidden"
        />
        <Image
          src="/img/logo.png"
          alt="logo"
          width={48}
          height={40}
          className="object-contain hidden group-hover:block"
        />
      </Link>
      <div className="flex items-center gap-5">
        <Link className="lg:flex hidden" href={"https://github.com/CenCiviC"}>
          <Image
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIC4yOTdjLTYuNjMgMC0xMiA1LjM3My0xMiAxMiAwIDUuMzAzIDMuNDM4IDkuOCA4LjIwNSAxMS4zODUuNi4xMTMuODItLjI1OC44Mi0uNTc3IDAtLjI4NS0uMDEtMS4wNC0uMDE1LTIuMDQtMy4zMzguNzI0LTQuMDQyLTEuNjEtNC4wNDItMS42MUM0LjQyMiAxOC4wNyAzLjYzMyAxNy43IDMuNjMzIDE3LjdjLTEuMDg3LS43NDQuMDg0LS43MjkuMDg0LS43MjkgMS4yMDUuMDg0IDEuODM4IDEuMjM2IDEuODM4IDEuMjM2IDEuMDcgMS44MzUgMi44MDkgMS4zMDUgMy40OTUuOTk4LjEwOC0uNzc2LjQxNy0xLjMwNS43Ni0xLjYwNS0yLjY2NS0uMy01LjQ2Ni0xLjMzMi01LjQ2Ni01LjkzIDAtMS4zMS40NjUtMi4zOCAxLjIzNS0zLjIyLS4xMzUtLjMwMy0uNTQtMS41MjMuMTA1LTMuMTc2IDAgMCAxLjAwNS0uMzIyIDMuMyAxLjIzLjk2LS4yNjcgMS45OC0uMzk5IDMtLjQwNSAxLjAyLjAwNiAyLjA0LjEzOCAzIC40MDUgMi4yOC0xLjU1MiAzLjI4NS0xLjIzIDMuMjg1LTEuMjMuNjQ1IDEuNjUzLjI0IDIuODczLjEyIDMuMTc2Ljc2NS44NCAxLjIzIDEuOTEgMS4yMyAzLjIyIDAgNC42MS0yLjgwNSA1LjYyNS01LjQ3NSA1LjkyLjQyLjM2LjgxIDEuMDk2LjgxIDIuMjIgMCAxLjYwNi0uMDE1IDIuODk2LS4wMTUgMy4yODYgMCAuMzE1LjIxLjY5LjgyNS41N0MyMC41NjUgMjIuMDkyIDI0IDE3LjU5MiAyNCAxMi4yOTdjMC02LjYyNy01LjM3My0xMi0xMi0xMiIvPjwvc3ZnPg=="
            alt="github"
            width={24}
            height={24}
          />
        </Link>
        <Link
          className="lg:flex hidden"
          href={
            "https://www.linkedin.com/in/%EA%B2%BD%EB%B9%88-%EC%9E%84-098447307/"
          }
        >
          <Image
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTIwLjQ0NyAyMC40NTJoLTMuNTU0di01LjU2OWMwLTEuMzI4LS4wMjctMy4wMzctMS44NTItMy4wMzctMS44NTMgMC0yLjEzNiAxLjQ0NS0yLjEzNiAyLjkzOXY1LjY2N0g5LjM1MVY5aDMuNDE0djEuNTYxaC4wNDZjLjQ3Ny0uOSAxLjYzNy0xLjg1IDMuMzctMS44NSAzLjYwMSAwIDQuMjY3IDIuMzcgNC4yNjcgNS40NTV2Ni4yODZ6TTUuMzM3IDcuNDMzYTIuMDYyIDIuMDYyIDAgMCAxLTIuMDYzLTIuMDY1IDIuMDY0IDIuMDY0IDAgMSAxIDIuMDYzIDIuMDY1em0xLjc4MiAxMy4wMTlIMy41NTVWOWgzLjU2NHYxMS40NTJ6TTIyLjIyNSAwSDEuNzcxQy43OTIgMCAwIC43NzQgMCAxLjcyOXYyMC41NDJDMCAyMy4yMjcuNzkyIDI0IDEuNzcxIDI0aDIwLjQ1MUMyMy4yIDI0IDI0IDIzLjIyNyAyNCAyMi4yNzFWMS43MjlDMjQgLjc3NCAyMy4yIDAgMjIuMjIyIDBoLjAwM3oiLz48L3N2Zz4="
            alt="linkedin"
            width={24}
            height={24}
          />
        </Link>
        <SearchBar />
      </div>
    </nav>
  );
}
