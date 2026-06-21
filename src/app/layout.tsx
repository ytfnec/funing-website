import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "烟台富宁电子有限公司 | Yantai Funing Electronics Co., Ltd.",
  description:
    "专业电子制造服务商，专注PCB制造、SMT贴片、电子组装及OEM/ODM服务。Professional electronics manufacturing services - PCB, SMT, PCBA, OEM/ODM.",
  keywords: [
    "烟台富宁电子",
    "PCB制造",
    "SMT贴片",
    "电子组装",
    "OEM",
    "ODM",
    "PCBA",
    "Yantai Funing Electronics",
    "PCB Manufacturing",
    "SMT Assembly",
  ],
  authors: [{ name: "Yantai Funing Electronics Co., Ltd." }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
