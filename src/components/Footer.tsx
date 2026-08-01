'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export function Footer() {
  const { t } = useLang();

  const footerLinks = {
    [t('footer.products')]: [
      { label: t('footer.saunaControllers'), href: '/products' },
      { label: t('footer.jacquardDrivers'), href: '/products' },
      { label: t('footer.allProducts'), href: '/products' },
    ],
    [t('footer.services')]: [
      { label: t('footer.oem'), href: '/oem' },
      { label: t('footer.techSupport'), href: '/contact' },
      { label: t('footer.productInquiry'), href: '/contact' },
    ],
    [t('footer.company')]: [
      { label: t('footer.aboutUs'), href: '/about' },
      { label: t('nav.contact'), href: '/contact' },
      { label: t('footer.resources'), href: '/resources' },
    ],
    [t('footer.legal')]: [
      { label: t('footer.privacy'), href: '/privacy' },
      { label: t('footer.terms'), href: '/terms' },
      { label: t('footer.cookies'), href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-[#050505] border-t border-[rgba(255,255,255,0.06)]">
      <div className="px-page py-[clamp(60px,8vw,100px)] mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Funing Electronics home">
              <div className="text-[var(--amber,#d8a35a)] text-[15px] tracking-[0.12em] uppercase font-bold">
                {t('brand.funing')} {t('brand.electronics')}
              </div>
            </Link>
            <p className="text-[var(--gray)] text-[13px] leading-relaxed mt-6 max-w-[220px]">
              {t('brand.tagline')}
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-4">
              <h4 className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)]">
                {category}
              </h4>
              <div className="flex flex-col gap-3">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[14px] text-[var(--soft-white)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-6 text-[var(--gray)] text-[12px]">
            <span>© {new Date().getFullYear()} Yantai Funing Electronics Co., Ltd. 烟台富宁电子有限公司</span>
            <span className="hidden md:inline">|</span>
            <span>{t('footer.rights')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[12px] text-[var(--gray)] hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-[12px] text-[var(--gray)] hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="/cookies" className="text-[12px] text-[var(--gray)] hover:text-white transition-colors">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
