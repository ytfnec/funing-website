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
  themeColor: "#f6f2ea",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${manrope.variable} h-full antialiased`}>
      <head>
        {/* Brand favicon: company logo (solid amber), served as a static asset. */}
        <link rel="icon" type="image/png" href="/assets/logo-favicon.png?v=2" sizes="64x64" />
        <link rel="icon" type="image/png" href="/assets/logo-favicon-32.png?v=2" sizes="32x32" />
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
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <LanguageProvider>
          <Header />
          <main className="flex-1 pt-[64px]">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
