import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "テシゴト — 毎回の手作業をボタン1つに",
  description: "繰り返しの手作業を登録して、ワンクリックで自動実行",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${geist.className} min-h-full bg-gray-50`}>{children}</body>
    </html>
  );
}
