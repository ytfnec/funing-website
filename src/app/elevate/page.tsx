'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function ElevatePage() {
  const { t } = useLang();

  return (
    <section className="px-page py-[clamp(80px,10vw,140px)] bg-[#050505]">
      <div className="max-w-[1200px] mx-auto text-center">
        <p className="eyebrow mb-6">{t('elevate.eyebrow')}</p>
        <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-6">
          {t('elevate.title')}
        </h1>
        <p className="body-text max-w-[600px] mx-auto mb-10">
          {t('elevate.desc')}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/contact" className="btn btn-primary">{t('elevate.btn1')}</Link>
          <Link href="/about" className="btn btn-secondary">{t('elevate.btn2')}</Link>
        </div>
      </div>
    </section>
  );
}
