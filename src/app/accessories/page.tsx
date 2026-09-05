'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function AccessoriesPage() {
  const { t } = useLang();

  const accessories = [
    { name: t('acc.i1.name'), cat: t('acc.i1.cat'), desc: t('acc.i1.desc'), price: t('acc.i1.price') },
    { name: t('acc.i2.name'), cat: t('acc.i2.cat'), desc: t('acc.i2.desc'), price: t('acc.i2.price') },
    { name: t('acc.i3.name'), cat: t('acc.i3.cat'), desc: t('acc.i3.desc'), price: t('acc.i3.price') },
    { name: t('acc.i4.name'), cat: t('acc.i4.cat'), desc: t('acc.i4.desc'), price: t('acc.i4.price') },
    { name: t('acc.i5.name'), cat: t('acc.i5.cat'), desc: t('acc.i5.desc'), price: t('acc.i5.price') },
    { name: t('acc.i6.name'), cat: t('acc.i6.cat'), desc: t('acc.i6.desc'), price: t('acc.i6.price') },
    { name: t('acc.i7.name'), cat: t('acc.i7.cat'), desc: t('acc.i7.desc'), price: t('acc.i7.price') },
    { name: t('acc.i8.name'), cat: t('acc.i8.cat'), desc: t('acc.i8.desc'), price: t('acc.i8.price') },
    { name: t('acc.i9.name'), cat: t('acc.i9.cat'), desc: t('acc.i9.desc'), price: t('acc.i9.price') },
  ];

  return (
    <>
      <section className="px-page py-[clamp(80px,10vw,140px)] bg-cream">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="eyebrow mb-6">{t('acc.hero.eyebrow')}</p>
          <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-6">{t('acc.hero.title')}</h1>
          <p className="body-text max-w-[600px] mx-auto mb-10">
            {t('acc.hero.desc')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/quote" className="btn btn-primary">{t('acc.hero.cta1')}</Link>
            <Link href="/contact" className="btn btn-secondary">{t('acc.hero.cta2')}</Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-page py-[clamp(60px,8vw,80px)] bg-sand">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
          {accessories.map((item) => (
            <div
              key={item.name}
              className="bg-card border border-[rgba(32,29,23,0.06)] rounded-lg p-6 hover:border-[var(--amber)] transition-colors flex flex-col"
            >
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--amber)] mb-3">{item.cat}</span>
              <h3 className="text-[16px] font-bold mb-2 text-ink">{item.name}</h3>
              <p className="text-[var(--gray)] text-[14px] leading-relaxed mb-4 flex-1">{item.desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-[rgba(32,29,23,0.06)]">
                <span className="text-[14px]" style={{ color: 'var(--wood)' }}>{item.price}</span>
                <Link href="/quote" className="text-[var(--amber)] text-[12px] tracking-[0.12em] uppercase font-bold hover:text-ink transition-colors">
                  {t('acc.quote')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-page py-[clamp(60px,8vw,80px)] bg-cream text-center">
        <h2 className="text-[clamp(24px,3vw,36px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6">
          {t('acc.cta.title')}
        </h2>
        <p className="body-text max-w-[560px] mx-auto mb-8">
          {t('acc.cta.desc')}
        </p>
        <Link href="/contact" className="btn btn-primary">{t('acc.cta.btn')}</Link>
      </section>
    </>
  );
}
