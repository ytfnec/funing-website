'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function NotFound() {
  const { t } = useLang();

  return (
    <section className="px-page py-[clamp(80px,10vw,140px)] min-h-[60vh] flex items-center justify-center bg-cream">
      <div className="max-w-[500px] text-center">
        <p className="eyebrow mb-4">{t('notfound.eyebrow')}</p>
        <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-6">{t('notfound.title')}</h1>
        <p className="body-text mb-10">{t('notfound.desc')}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn btn-primary">{t('notfound.home')}</Link>
          <Link href="/contact" className="btn btn-secondary">{t('notfound.contact')}</Link>
        </div>
      </div>
    </section>
  );
}
