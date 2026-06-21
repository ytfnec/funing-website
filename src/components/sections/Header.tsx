'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/ContentContext';

const navSections = [
  { id: 'about', key: 'nav_about' as const },
  { id: 'products', key: 'nav_products' as const },
  { id: 'capabilities', key: 'nav_capabilities' as const },
  { id: 'quality', key: 'nav_quality' as const },
  { id: 'news', key: 'nav_news' as const },
  { id: 'contact', key: 'nav_contact' as const },
];

export default function Header() {
  const { toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 md:gap-3 shrink-0"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm md:text-base">FN</span>
            </div>
            <div className="hidden sm:block">
              <div className={`text-sm md:text-base font-bold leading-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                {t('hero_title').split('（')[0]}
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-white/10 ${
                  scrolled
                    ? 'text-gray-700 hover:text-teal-600 hover:bg-teal-50'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {t(section.key)}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className={`gap-1.5 ${scrolled ? 'text-gray-700 hover:text-teal-600' : 'text-white hover:text-white'}`}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">{t('nav_lang')}</span>
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`lg:hidden ${scrolled ? 'text-gray-700' : 'text-white'}`}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-border overflow-hidden"
          >
            <nav className="px-4 py-3 space-y-1">
              {navSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className="block w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-teal-50 hover:text-teal-600 transition-colors"
                >
                  {t(section.key)}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
