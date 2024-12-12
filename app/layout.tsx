import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/style/globals.css";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
});

export const metadata: Metadata = {
  title: "cencivic",
  description: "1.5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en">
        <body className={`${pretendard.className}`}>{children}</body>
      </html>
    </>
  );
}
