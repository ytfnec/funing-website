import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Funing Electronics | Precision Electronic Control Systems | 烟台富宁电子", template: "%s | Funing Electronics" },
  description: "Yantai Funing Electronics — infrared sauna controllers, jacquard machine driver cards, electronic control OEM/ODM. 烟台富宁电子——红外桑拿控制器、提花机电控、OEM/ODM定制。",
  metadataBase: new URL("https://fnec.net"),
  openGraph: {
    siteName: "Funing Electronics",
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-[#050505] text-[#f7f5ef]">
        <LanguageProvider>
          <Header />
          <main className="flex-1 pt-[64px]">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
