'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function ProductsPage() {
  const { t } = useLang();

  const products = [
    {
      slug: 'sauna-controllers',
      name: t('p.saunaControllers.name'),
      tagline: t('p.saunaControllers.sub'),
      price: t('prod.price.sample'),
      description: t('p.saunaControllers.desc'),
      specs: [t('p.saunaControllers.spec1'), t('p.saunaControllers.spec2'), t('p.saunaControllers.spec3'), t('p.saunaControllers.spec4')],
      icon: '⊞',
      placeholder: t('prod.placeholder1'),
    },
    {
      slug: 'jacquard-drivers',
      name: t('p.jacquard.name'),
      tagline: t('p.jacquard.sub'),
      price: t('prod.price.volume'),
      description: t('p.jacquard.desc'),
      specs: [t('p.jacquard.spec1'), t('p.jacquard.spec2'), t('p.jacquard.spec3'), t('p.jacquard.spec4')],
      icon: '⊟',
      placeholder: t('prod.placeholder2'),
    },
    {
      slug: 'branded-units',
      name: t('p.branded.name'),
      tagline: t('p.branded.sub'),
      price: t('prod.price.wholesale'),
      description: t('p.branded.desc'),
      specs: [t('p.branded.spec1'), t('p.branded.spec2'), t('p.branded.spec3'), t('p.branded.spec4')],
      icon: '◈',
      placeholder: t('prod.placeholder3'),
    },
    {
      slug: 'accessories',
      name: t('p.accessories.name'),
      tagline: t('p.accessories.sub'),
      price: t('prod.price.bulk'),
      description: t('p.accessories.desc'),
      specs: [t('p.accessories.spec1'), t('p.accessories.spec2'), t('p.accessories.spec3'), t('p.accessories.spec4')],
      icon: '◇',
      placeholder: t('prod.placeholder4'),
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="px-page py-[clamp(80px,12vw,140px)] bg-[#050505]">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="eyebrow mb-6">{t('prod.hero.eyebrow')}</p>
          <h1 className="text-[clamp(40px,6vw,80px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-8">
            {t('prod.hero.title1')}<br />{t('prod.hero.title2')}
          </h1>
          <p className="body-text max-w-[600px] mx-auto mb-12">
            {t('prod.hero.desc')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/quote" className="btn btn-primary">{t('prod.hero.cta1')}</Link>
            <Link href="/contact" className="btn btn-secondary">{t('prod.hero.cta2')}</Link>
          </div>
        </div>
      </section>

      {/* Product Listing */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808]">
        <div className="max-w-[1280px] mx-auto space-y-[clamp(48px,7vw,80px)]">
          {products.map((s, i) => (
            <article
              key={s.slug}
              className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)] items-center"
            >
              {/* Image Placeholder */}
              <div
                className={`block relative overflow-hidden ${i % 2 === 1 ? 'md:order-2' : ''}`}
              >
                <div className="aspect-[4/3] bg-[#0a0a0a] overflow-hidden flex items-center justify-center" style={{
                  background: "radial-gradient(circle at center, rgba(216,163,90,0.08), transparent 70%), linear-gradient(rgba(216,163,90,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(216,163,90,0.04) 1px, transparent 1px)",
                  backgroundSize: "100% 100%, 32px 32px, 32px 32px"
                }}>
                  <div className="text-center p-8">
                    <div className="text-[var(--amber)] text-[48px] mb-3 opacity-50">
                      {s.icon}
                    </div>
                    <div className="text-[var(--gray)] text-[12px] tracking-[0.2em] uppercase">
                      {s.placeholder}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={i % 2 === 1 ? 'md:order-1' : ''}>
                <p className="text-[11px] tracking-[0.22em] uppercase text-[var(--amber)] mb-4">
                  {s.tagline}
                </p>
                <h2 className="text-[clamp(28px,3.5vw,48px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-4">
                  {s.name}
                </h2>
                <p className="text-[var(--soft-white)] text-[clamp(16px,1.2vw,20px)] leading-relaxed mb-6 max-w-[500px]">
                  {s.description}
                </p>

                {/* Specs */}
                <ul className="grid grid-cols-2 gap-3 mb-8 max-w-[400px]">
                  {s.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2 text-[14px] text-[var(--gray)]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {spec}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-center gap-6 flex-wrap">
                  <span className="text-[18px] font-medium" style={{ color: 'var(--wood)' }}>
                    {s.price}
                  </span>
                  <Link href="/quote" className="btn btn-primary text-sm">
                    {t('prod.cta.btn')}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* OEM/ODM CTA */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#050505] text-center">
        <p className="eyebrow mb-6">{t('prod.cta.eyebrow')}</p>
        <h2 className="text-[clamp(24px,3vw,40px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-8 max-w-[700px] mx-auto">
          {t('prod.cta.title')}
        </h2>
        <p className="body-text max-w-[560px] mx-auto mb-10">
          {t('prod.cta.desc')}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/contact" className="btn btn-primary">{t('prod.cta.btn1')}</Link>
          <Link href="/quote" className="btn btn-secondary">{t('prod.cta.btn2')}</Link>
        </div>
      </section>
    </>
  );
}
