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
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
