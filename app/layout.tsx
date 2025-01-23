import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/style/globals.css";
import TopBar from "@/components/topbar";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
});

export const metadata: Metadata = {
  title: "kyungbin.im",
  description: "임경빈의 블로그입니다.",
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
    <html lang="en">
      <body className={`${pretendard.className}`}>
        <main className="flex flex-col">
          <TopBar />
          {children}
        </main>
      </body>
    </html>
  );
}
