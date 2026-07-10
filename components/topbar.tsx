"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useSidebarStore } from "@/lib/store/sidebarStore";

import { GithubSvg, LinkedinSvg, MenuSvg } from "./icons";
import SearchBar from "./searchbar";

export default function TopBar({
  hasMenuBtn = true,
}: {
  hasMenuBtn?: boolean;
}) {
  const toggleSidebar = useSidebarStore(state => state.toggleSidebar);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`flex sticky z-50 top-0 left-0 items-center justify-between shrink-0 w-full h-[var(--topbar-height)] px-7 bg-paper transition-shadow duration-200 ${
        scrolled ? "shadow-[0_1px_0_var(--hair-solid)]" : ""
      }`}
    >
      <div className="flex items-center gap-1">
        {hasMenuBtn && (
          <button
            type="button"
            aria-label="메뉴 열기"
            onClick={toggleSidebar}
            className="lg:hidden text-ink2 hover:text-ink p-1.5 mr-1 cursor-pointer"
          >
            <MenuSvg />
          </button>
        )}

        <Link
          href={"/"}
          className="group flex items-center gap-2.5 font-bold text-[15.5px] tracking-[-0.01em] text-ink"
        >
          <span className="relative block w-[30px] h-[30px]">
            <Image
              src="/img/black.png"
              alt=""
              fill
              sizes="30px"
              className="object-contain transition-opacity duration-200 opacity-100 group-hover:opacity-0 dark:opacity-0"
            />
            <Image
              src="/img/color.png"
              alt=""
              fill
              sizes="30px"
              className="object-contain transition-opacity duration-200 opacity-0 group-hover:opacity-100 dark:opacity-100"
            />
          </span>
          kyungbin.im
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href={"/dot/kyungbin/About%20me.md"}
          className="hidden sm:block text-sm font-medium text-ink2 hover:text-ink transition-colors"
        >
          About me
        </Link>
        <Link
          href={"/dot/kyungbin/23.02.24%20kyungbin%20logo.md"}
          className="hidden sm:block text-sm font-medium text-ink2 hover:text-ink transition-colors"
        >
          Dots
        </Link>
        <Link
          className="hidden lg:flex text-ink2 hover:text-ink transition-colors"
          aria-label="GitHub"
          href={"https://github.com/CenCiviC"}
        >
          <GithubSvg />
        </Link>
        <Link
          className="hidden lg:flex text-ink2 hover:text-ink transition-colors"
          aria-label="LinkedIn"
          href={
            "https://www.linkedin.com/in/%EA%B2%BD%EB%B9%88-%EC%9E%84-098447307/"
          }
        >
          <LinkedinSvg />
        </Link>
        <SearchBar />
      </div>
    </nav>
  );
}
