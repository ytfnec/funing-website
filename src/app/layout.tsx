import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ViewTracker } from "@/components/ViewTracker";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

// Self-hosted Manrope variable font (wght 200–800). Replaces the render-blocking
// Google Fonts stylesheet: the font is downloaded at build time, emitted as a
// static asset, and preloaded automatically — no external request, no FOUT.
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Funing Electronics | Precision Electronic Control Systems | 烟台富宁电子", template: "%s | Funing Electronics" },
  description: "Yantai Funing Electronics — infrared sauna controllers, jacquard machine driver cards, electronic control OEM/ODM. 烟台富宁电子——红外桑拿控制器、提花机电控、OEM/ODM定制。",
  metadataBase: new URL("https://fnec.net"),
  openGraph: {
    siteName: "Funing Electronics",
    type: "website",
    locale: "en_US",
    images: [{ url: "/opengraph.png", width: 1200, height: 630 }],
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
    <html lang="zh-CN" className={`${manrope.variable} h-full antialiased`}>
      <head>
        {/* Critical resource inlining: SVG favicon embedded as a data URI so the
            browser makes zero extra requests for it (no /favicon.ico 404). */}
        <link
          rel="icon"
          href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTQiIGZpbGw9IiMwNTA1MDUiLz48cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHJ4PSIxMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZDhhMzVhIiBzdHJva2Utb3BhY2l0eT0iMC41IiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSIzMiIgeT0iNDQiIGZvbnQtZmFtaWx5PSJBcmlhbCxIZWx2ZXRpY2Esc2Fucy1zZXJpZiIgZm9udC1zaXplPSIzNiIgZm9udC13ZWlnaHQ9IjcwMCIgZmlsbD0iI2Q4YTM1YSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RjwvdGV4dD48L3N2Zz4="
          sizes="any"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  name: 'Funing Electronics',
                  alternateName: '烟台富宁电子有限公司',
                  url: 'https://fnec.net',
                  email: 'info@fnec.net',
                  telephone: '+86-535-6778069',
                  address: {
                    '@type': 'PostalAddress',
                    addressCountry: 'CN',
                    addressRegion: 'Shandong',
                    addressLocality: 'Yantai',
                  },
                  description: 'Infrared sauna controllers, jacquard machine driver cards, and electronic control OEM/ODM. 红外桑拿控制器、提花机电控、OEM/ODM定制。',
                },
                {
                  '@type': 'WebSite',
                  name: 'Funing Electronics',
                  url: 'https://fnec.net',
                  inLanguage: ['en', 'zh-CN'],
                },
              ],
            }),
          }}
        />
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
