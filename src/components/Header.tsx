'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLang, LanguageSwitcher } from '@/lib/i18n';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/products', label: t('nav.products') },
    { href: '/oem', label: t('nav.oem') },
    { href: '/accessories', label: t('nav.accessories') },
    { href: '/about', label: t('nav.about') },
    { href: '/news', label: t('nav.news') },
    { href: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${scrolled ? 'bg-[#050505]/95 border-[rgba(255,255,255,0.1)] shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'bg-[#050505]/80 border-[rgba(255,255,255,0.06)]'}`}>
      <div className="px-page h-[64px] flex items-center justify-between mx-auto max-w-[1400px]">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-3" aria-label="Funing Electronics home">
          {!logoFailed ? (
            // Transparent-background logo (public/assets/logo.png), served
            // as a static asset through the CDN. Directly on the dark header.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/assets/logo.png"
              alt="Funing Electronics"
              className="h-10 w-auto object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <>
              <div className="text-[var(--amber,#d8a35a)] text-[15px] tracking-[0.12em] uppercase font-bold">
                {t('brand.funing')}
              </div>
              <span className="text-[11px] tracking-[0.16em] uppercase text-[var(--gray)] hidden sm:inline">
                {t('brand.electronics')}
              </span>
            </>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] tracking-[0.14em] uppercase text-[var(--gray)] hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          <Link
            href="/quote"
            className="text-[12px] tracking-[0.14em] uppercase text-[var(--amber)] hover:text-white transition-colors font-bold"
          >
            {t('nav.quote')}
          </Link>
          <Link
            href="/contact"
            className="btn btn-primary text-xs py-3 px-5"
          >
            {t('nav.contactUs')}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            className="text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-[#050505] border-b border-[rgba(255,255,255,0.06)]">
          <nav className="px-page py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] tracking-[0.14em] uppercase text-[var(--gray)] hover:text-white transition-colors py-2"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <Link
                href="/quote"
                className="btn btn-secondary text-xs flex-1 py-3"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.quote')}
              </Link>
              <Link
                href="/contact"
                className="btn btn-primary text-xs flex-1 py-3"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.contactUs')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
