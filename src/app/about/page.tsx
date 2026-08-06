'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useLang } from '@/lib/i18n';

export default function AboutPage() {
  const { t } = useLang();

  const milestones = [
    { year: '2010', title: t('about.m2010.title'), desc: t('about.m2010.desc') },
    { year: '2013', title: t('about.m2013.title'), desc: t('about.m2013.desc') },
    { year: '2016', title: t('about.m2016.title'), desc: t('about.m2016.desc') },
    { year: '2019', title: t('about.m2019.title'), desc: t('about.m2019.desc') },
    { year: '2022', title: t('about.m2022.title'), desc: t('about.m2022.desc') },
    { year: '2025', title: t('about.m2025.title'), desc: t('about.m2025.desc') },
  ];

  const team = [
    { title: t('about.team.1.title'), count: t('about.team.1.count'), desc: t('about.team.1.desc') },
    { title: t('about.team.2.title'), count: t('about.team.2.count'), desc: t('about.team.2.desc') },
    { title: t('about.team.3.title'), count: t('about.team.3.count'), desc: t('about.team.3.desc') },
  ];

  return (
    <>
      {/* Hero */}
      <section className="px-page py-[clamp(80px,12vw,140px)] bg-[#050505]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)] items-center">
            <div>
              <p className="eyebrow mb-6">{t('about.hero.eyebrow')}</p>
              <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-8">
                {t('about.hero.title1')}<br />{t('about.hero.title2')}
              </h1>
              <p className="body-text mb-6">
                {t('about.hero.p1')}
              </p>
              <p className="body-text mb-8">
                {t('about.hero.p2')}
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/contact" className="btn btn-primary">{t('about.hero.btn1')}</Link>
                <Link href="/quote" className="btn btn-secondary">{t('about.hero.btn2')}</Link>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden mb-6">
              <img src="/assets/about-factory.webp" alt={t('about.info.title')} className="w-full h-auto block" loading="lazy" />
            </div>
            <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-8">
              <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">{t('about.info.title')}</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-[var(--amber)] mt-0.5" />
                  <div>
                    <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-1">{t('about.info.address')}</div>
                    <div className="text-white">{t('about.info.addr1')}</div>
                    <div className="text-[var(--gray)] text-sm">{t('about.info.addr2')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-[var(--amber)] mt-0.5" />
                  <div>
                    <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-1">{t('about.info.phone')}</div>
                    <div className="text-white">+86 535-6778069</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-[var(--amber)] mt-0.5" />
                  <div>
                    <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-1">{t('about.info.email')}</div>
                    <div className="text-white">info@fnec.net</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808]">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((item) => (
            <div key={item.title} className="text-center p-8 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg">
              <div className="text-[clamp(40px,5vw,56px)] font-bold mb-2" style={{ color: 'var(--amber)' }}>{item.count}</div>
              <h3 className="text-[14px] tracking-[0.14em] uppercase font-bold mb-3">{item.title}</h3>
              <p className="text-[var(--gray)] text-[14px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#050505]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-center text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-16">
            {t('about.timeline.title')}
          </h2>

          <div className="relative">
            <div className="hidden md:block absolute left-[59px] top-0 bottom-0 w-px bg-[var(--line)]" />

            <div className="space-y-12">
              {milestones.map((m) => (
                <div key={m.year} className="flex gap-6 items-start">
                  <div className="relative z-10 flex-shrink-0 w-[118px] hidden md:flex items-center justify-end">
                    <span className="text-[var(--amber)] text-[14px] tracking-[0.12em] font-bold">{m.year}</span>
                  </div>
                  {/* Mobile year */}
                  <span className="md:hidden flex-shrink-0 w-[60px] text-[var(--amber)] text-[12px] tracking-[0.12em] font-bold pt-1">{m.year}</span>

                  <div className="flex-1 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-5 hover:border-[rgba(255,255,255,0.12)] transition-colors">
                    <h3 className="text-[16px] tracking-[0.06em] uppercase font-bold mb-2">{m.title}</h3>
                    <p className="text-[var(--gray)] text-[14px] leading-relaxed">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808] text-center">
        <h2 className="text-[clamp(28px,3.5vw,44px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6 max-w-[600px] mx-auto">
          {t('about.cta.title')}
        </h2>
        <p className="body-text max-w-[560px] mx-auto mb-10">
          {t('about.cta.desc')}
        </p>
        <Link href="/contact" className="btn btn-primary">
          {t('about.cta.btn')} <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </>
  );
}
