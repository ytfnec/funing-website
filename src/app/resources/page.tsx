'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function ResourcesPage() {
  const { t } = useLang();

  const resources = [
    { title: t('res.1.title'), desc: t('res.1.desc'), items: [t('res.1.i1'), t('res.1.i2'), t('res.1.i3'), t('res.1.i4')] },
    { title: t('res.2.title'), desc: t('res.2.desc'), items: [t('res.2.i1'), t('res.2.i2'), t('res.2.i3'), t('res.2.i4')] },
    { title: t('res.3.title'), desc: t('res.3.desc'), items: [t('res.3.i1'), t('res.3.i2'), t('res.3.i3'), t('res.3.i4')] },
    { title: t('res.4.title'), desc: t('res.4.desc'), items: [t('res.4.i1'), t('res.4.i2'), t('res.4.i3'), t('res.4.i4')] },
  ];

  return (
    <>
      <section className="px-page py-[clamp(80px,10vw,140px)] bg-[#050505]">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="eyebrow mb-6">{t('res.hero.eyebrow')}</p>
          <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-6">{t('res.hero.title')}</h1>
          <p className="body-text max-w-[600px] mx-auto mb-10">
            {t('res.hero.desc')}
          </p>
          <Link href="/contact" className="btn btn-primary">{t('res.hero.cta')}</Link>
        </div>
      </section>

      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808]">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {resources.map((r) => (
            <div key={r.title} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 hover:border-[rgba(255,255,255,0.12)] transition-colors">
              <h3 className="text-[16px] tracking-[0.06em] uppercase font-bold mb-3">{r.title}</h3>
              <p className="text-[var(--gray)] text-[14px] leading-relaxed mb-4">{r.desc}</p>
              <ul className="space-y-2">
                {r.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[14px] text-[var(--soft-white)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
