'use client';

import { useLanguage } from '@/context/ContentContext';
import { Globe } from 'lucide-react';

const navSections = [
  { id: 'about', zhKey: 'nav_about' as const },
  { id: 'products', zhKey: 'nav_products' as const },
  { id: 'capabilities', zhKey: 'nav_capabilities' as const },
  { id: 'quality', zhKey: 'nav_quality' as const },
  { id: 'news', zhKey: 'nav_news' as const },
  { id: 'contact', zhKey: 'nav_contact' as const },
];

export default function Footer() {
  const { t } = useLanguage();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">FN</span>
              </div>
              <span className="text-lg font-bold text-white">
                {t('hero_title').split('（')[0]}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer_desc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer_links')}
            </h3>
            <ul className="space-y-2.5">
              {navSections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
                  >
                    {t(section.zhKey)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {t('footer_contact')}
            </h3>
            <div className="space-y-2.5 text-sm text-gray-400">
              <p className="flex items-start gap-2">
                <Globe className="w-4 h-4 mt-0.5 shrink-0 text-teal-500" />
                <span>{t('contact_address')}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0 text-teal-500">📞</span>
                <span>{t('contact_phone')}</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="shrink-0 text-teal-500">✉️</span>
                <span>{t('contact_email')}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>{t('footer_copyright')}</p>
          <p>{t('footer_icp')}</p>
        </div>
      </div>
    </footer>
  );
}
