'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function ThankYouPage() {
  const { t } = useLang();

  return (
    <section className="px-page py-[clamp(80px,10vw,140px)] min-h-[60vh] flex items-center justify-center bg-[#050505]">
      <div className="max-w-[500px] text-center">
        <div className="w-16 h-16 bg-[var(--amber)] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-[clamp(28px,3.5vw,42px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-4">{t('thankyou.title')}</h1>
        <p className="body-text mb-8">{t('thankyou.desc')}</p>
        <Link href="/" className="btn btn-primary">{t('thankyou.home')}</Link>
      </div>
    </section>
  );
}
