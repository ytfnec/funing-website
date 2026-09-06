'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '@/lib/i18n';

export function Footer() {
  const { t } = useLang();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!email) return;

    setSubscribing(true);
    setNewsletterStatus('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Subscription failed');
      }
      setNewsletterStatus(data.alreadySubscribed ? '✓ Already subscribed' : '✓ Subscribed');
      setNewsletterEmail('');
    } catch (e: any) {
      setNewsletterStatus(e.message || 'Subscription failed');
    } finally {
      setSubscribing(false);
    }
  };

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
      { label: t('footer.partner'), href: '/elevate' },
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
    <footer className="bg-cream border-t border-[rgba(32,29,23,0.06)]">
      <div className="px-page py-[clamp(60px,8vw,100px)] mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Funing Electronics home" className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/logo-blue-solid.png"
                alt="Funing Electronics"
                className="h-11 w-auto object-contain"
              />
              <span className="brand-zh text-[20px]">富宁电子</span>
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
                    className="text-[14px] text-[var(--soft-white)] hover:text-ink transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 pt-10 border-t border-[rgba(32,29,23,0.06)] max-w-[1200px]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-[13px] tracking-[0.16em] uppercase font-bold text-ink mb-2">
                {t('footer.newsletter.title')}
              </h3>
              <p className="text-[var(--gray)] text-[13px] max-w-[420px]">
                {t('footer.newsletter.desc')}
              </p>
            </div>
            <form
              className="flex gap-3 w-full lg:w-auto"
              onSubmit={handleSubscribe}
            >
              <label className="sr-only" htmlFor="newsletter-email">{t('footer.newsletter.placeholder')}</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 lg:w-[280px] px-4 py-3 bg-card border border-[rgba(32,29,23,0.1)] rounded-full text-ink placeholder-[rgba(32,29,23,0.3)] text-sm focus:outline-none focus:border-[var(--amber)]"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="btn btn-primary text-xs py-3 px-6 disabled:opacity-50 whitespace-nowrap"
              >
                {subscribing ? t('footer.newsletter.subscribing') : t('footer.newsletter.subscribe')}
              </button>
            </form>
          </div>
          {newsletterStatus && (
            <p className={`mt-3 text-[13px] ${newsletterStatus.includes('✓') ? 'text-green-400' : 'text-[var(--amber)]'}`}>
              {newsletterStatus}
            </p>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-[rgba(32,29,23,0.06)]">
          <div className="flex items-center gap-6 text-[var(--gray)] text-[12px]">
            <span>© {new Date().getFullYear()} Yantai Funing Electronics Co., Ltd. 烟台富宁电子有限公司</span>
            <span className="hidden md:inline">|</span>
            <span>{t('footer.rights')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[12px] text-[var(--gray)] hover:text-ink transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="text-[12px] text-[var(--gray)] hover:text-ink transition-colors">
              {t('footer.terms')}
            </Link>
            <Link href="/cookies" className="text-[12px] text-[var(--gray)] hover:text-ink transition-colors">
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
