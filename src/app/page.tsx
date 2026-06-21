'use client';

import { ContentProvider, useContent } from '@/context/ContentContext';
import Header from '@/components/sections/Header';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProductsSection from '@/components/sections/ProductsSection';
import CapabilitiesSection from '@/components/sections/CapabilitiesSection';
import QualitySection from '@/components/sections/QualitySection';
import NewsSection from '@/components/sections/NewsSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/sections/Footer';
import AdminPanel from '@/components/admin/AdminPanel';

function HomeContent() {
  const { language, toggleLanguage, t, contents, news, refreshContent } = useContent();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <CapabilitiesSection />
        <QualitySection />
        <NewsSection />
        <ContactSection />
      </main>
      <Footer />
      <AdminPanel contents={contents} news={news} onRefresh={refreshContent} />
    </div>
  );
}

export default function Home() {
  return (
    <ContentProvider>
      <HomeContent />
    </ContentProvider>
  );
}
