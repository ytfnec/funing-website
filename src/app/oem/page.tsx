'use client';

import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function OEMPage() {
  const { t } = useLang();

  const services = [
    {
      title: t('oem.s1.title'),
      desc: t('oem.s1.desc'),
      details: [t('oem.s1.d1'), t('oem.s1.d2'), t('oem.s1.d3'), t('oem.s1.d4')],
    },
    {
      title: t('oem.s2.title'),
      desc: t('oem.s2.desc'),
      details: [t('oem.s2.d1'), t('oem.s2.d2'), t('oem.s2.d3'), t('oem.s2.d4')],
    },
    {
      title: t('oem.s3.title'),
      desc: t('oem.s3.desc'),
      details: [t('oem.s3.d1'), t('oem.s3.d2'), t('oem.s3.d3'), t('oem.s3.d4')],
    },
    {
      title: t('oem.s4.title'),
      desc: t('oem.s4.desc'),
      details: [t('oem.s4.d1'), t('oem.s4.d2'), t('oem.s4.d3'), t('oem.s4.d4')],
    },
    {
      title: t('oem.s5.title'),
      desc: t('oem.s5.desc'),
      details: [t('oem.s5.d1'), t('oem.s5.d2'), t('oem.s5.d3'), t('oem.s5.d4')],
    },
    {
      title: t('oem.s6.title'),
      desc: t('oem.s6.desc'),
      details: [t('oem.s6.d1'), t('oem.s6.d2'), t('oem.s6.d3'), t('oem.s6.d4')],
    },
  ];

  const process = [
    { step: '01', title: t('oem.p1.title'), desc: t('oem.p1.desc') },
    { step: '02', title: t('oem.p2.title'), desc: t('oem.p2.desc') },
    { step: '03', title: t('oem.p3.title'), desc: t('oem.p3.desc') },
    { step: '04', title: t('oem.p4.title'), desc: t('oem.p4.desc') },
    { step: '05', title: t('oem.p5.title'), desc: t('oem.p5.desc') },
  ];

  return (
    <>
      {/* Hero */}
      <section className="px-page py-[clamp(80px,12vw,140px)] bg-[#050505]">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="eyebrow mb-6">{t('oem.hero.eyebrow')}</p>
          <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-8">
            {t('oem.hero.title1')}<br />{t('oem.hero.title2')}
          </h1>
          <p className="body-text max-w-[640px] mx-auto mb-12">
            {t('oem.hero.desc')}
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/quote" className="btn btn-primary">{t('oem.hero.cta1')}</Link>
            <Link href="/contact" className="btn btn-secondary">{t('oem.hero.cta2')}</Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808]">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-center text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-16">
            {t('oem.what.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div key={svc.title} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 hover:border-[var(--amber)] transition-colors flex flex-col">
                <h3 className="text-[16px] tracking-[0.08em] uppercase font-bold mb-3">{svc.title}</h3>
                <p className="text-[var(--gray)] text-[14px] leading-relaxed mb-4">{svc.desc}</p>
                <ul className="space-y-2 mt-auto">
                  {svc.details.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-[13px] text-[var(--gray)]">
                      <Check className="w-4 h-4 text-[var(--amber)] mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#050505]">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-center text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6">
            {t('oem.process.title')}
          </h2>
          <p className="text-center text-[var(--gray)] mb-16 max-w-[600px] mx-auto">
            {t('oem.process.desc')}
          </p>

          <div className="relative">
            {/* Vertical line (desktop) */}
            <div className="hidden md:block absolute left-[23px] top-0 bottom-0 w-px bg-[var(--line)]" />

            <div className="space-y-10">
              {process.map((p) => (
                <div key={p.step} className="flex gap-6 items-start">
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-[var(--amber)] text-[#050505] flex items-center justify-center text-sm font-bold">
                    {p.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-[18px] tracking-[0.06em] uppercase font-bold mb-2">{p.title}</h3>
                    <p className="text-[var(--gray)] text-[15px] leading-relaxed max-w-[600px]">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808] text-center">
        <h2 className="text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6 max-w-[700px] mx-auto">
          {t('oem.cta.title')}
        </h2>
        <p className="body-text max-w-[560px] mx-auto mb-10">
          {t('oem.cta.desc')}
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/quote" className="btn btn-primary">
            {t('oem.cta.btn1')} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            {t('oem.cta.btn2')}
          </Link>
        </div>
      </section>
    </>
  );
}
