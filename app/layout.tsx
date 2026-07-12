import localFont from "next/font/local";

import type { Metadata } from "next";

import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/config";

import "@/style/globals.css";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: "ko_KR",
    type: "website",
    url: SITE_URL,
  },
  icons: {
    icon: "/img/logo-circle.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className}`}>
        {/* 페이지별 main은 각 페이지가 소유한다 (main 중첩 방지) */}
        <div className="flex flex-col">{children}</div>
      </body>
    </html>
  );
}
