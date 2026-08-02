'use client';

import Image from "next/image";
import { useLang } from "@/lib/i18n";

export default function Home() {
  const { t } = useLang();

  const products = [
    {
      key: "sauna-controllers",
      name: t('p.saunaControllers.name'),
      sub: t('p.saunaControllers.sub'),
      desc: t('p.saunaControllers.desc'),
      icon: "⊞",
      specs: [t('p.saunaControllers.spec1'), t('p.saunaControllers.spec2'), t('p.saunaControllers.spec3'), t('p.saunaControllers.spec4')],
    },
    {
      key: "jacquard-drivers",
      name: t('p.jacquard.name'),
      sub: t('p.jacquard.sub'),
      desc: t('p.jacquard.desc'),
      icon: "⊟",
      specs: [t('p.jacquard.spec1'), t('p.jacquard.spec2'), t('p.jacquard.spec3'), t('p.jacquard.spec4')],
    },
    {
      key: "branded-units",
      name: t('p.branded.name'),
      sub: t('p.branded.sub'),
      desc: t('p.branded.desc'),
      icon: "◈",
      specs: [t('p.branded.spec1'), t('p.branded.spec2'), t('p.branded.spec3'), t('p.branded.spec4')],
    },
    {
      key: "accessories",
      name: t('p.accessories.name'),
      sub: t('p.accessories.sub'),
      desc: t('p.accessories.desc'),
      icon: "◇",
      specs: [t('p.accessories.spec1'), t('p.accessories.spec2'), t('p.accessories.spec3'), t('p.accessories.spec4')],
    },
  ];

  const whyUs = [
    {
      num: "01",
      title: t('home.why.1.title'),
      bullets: [t('home.why.1.b1'), t('home.why.1.b2'), t('home.why.1.b3')],
    },
    {
      num: "02",
      title: t('home.why.2.title'),
      bullets: [t('home.why.2.b1'), t('home.why.2.b2'), t('home.why.2.b3')],
    },
    {
      num: "03",
      title: t('home.why.3.title'),
      bullets: [t('home.why.3.b1'), t('home.why.3.b2'), t('home.why.3.b3')],
    },
  ];

  const oemServices = [
    { title: t('home.oem.s1.title'), desc: t('home.oem.s1.desc') },
    { title: t('home.oem.s2.title'), desc: t('home.oem.s2.desc') },
    { title: t('home.oem.s3.title'), desc: t('home.oem.s3.desc') },
    { title: t('home.oem.s4.title'), desc: t('home.oem.s4.desc') },
    { title: t('home.oem.s5.title'), desc: t('home.oem.s5.desc') },
    { title: t('home.oem.s6.title'), desc: t('home.oem.s6.desc') },
  ];

  const faq = [
    { q: t('home.faq.q1'), a: t('home.faq.a1') },
    { q: t('home.faq.q2'), a: t('home.faq.a2') },
    { q: t('home.faq.q3'), a: t('home.faq.a3') },
    { q: t('home.faq.q4'), a: t('home.faq.a4') },
    { q: t('home.faq.q5'), a: t('home.faq.a5') },
    { q: t('home.faq.q6'), a: t('home.faq.a6') },
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] min-h-[calc(100vh-84px)] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero-1920.webp"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "rgba(5,5,5,0.55)" }} />
        </div>

        <div className="relative z-10 px-page max-w-[1000px] mx-auto">
          <div className="flex flex-col items-center max-[1000px]:flex max-[1000px]:flex-col max-[1000px]:h-full max-[1000px]:justify-center text-center max-[1000px]:px-4 animate-fade-in">
            <div className="w-full max-w-[620px] mb-[clamp(40px,9vw,56px)]">
              <p className="eyebrow mb-6" style={{ marginTop: 0, marginBottom: "24px" }}>
                {t('home.hero.eyebrow')}
              </p>
              <h1 className="section-title" style={{ marginTop: 0, marginBottom: "24px" }}>
                {t('home.hero.title1')}{" "}
                <span className="tracking-[0.04em]">{t('home.hero.title2')}</span>
              </h1>
              <p className="body-text" style={{ marginTop: 0, marginBottom: "clamp(40px, 9vw, 56px)", maxWidth: "560px" }}>
                {t('home.hero.desc')}
              </p>
            </div>

            <div className="flex gap-4 flex-wrap justify-center w-full">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.location.href = "/quote"}
              >
                {t('home.hero.ctaQuote')}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.location.href = "/contact"}
              >
                {t('home.hero.ctaContact')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="products" className="scroll-mt-0 px-page bg-gradient-to-b from-[#060606] to-[#121212]" style={{
        paddingTop: "clamp(80px, 12vw, 140px)",
        paddingBottom: "clamp(80px, 12vw, 140px)"
      }}>
        <div className="grid grid-cols-[1fr_1fr] gap-[60px] items-end max-[900px]:grid-cols-1 max-[900px]:gap-[32px]" style={{ marginBottom: "clamp(56px, 8vw, 88px)" }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: "24px" }}>{t('home.products.eyebrow')}</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>{t('home.products.title')}</h2>
          </div>
          <div className="flex flex-col items-start max-[900px]:items-start">
            <p className="body-text max-w-[460px]" style={{ marginTop: 0, marginBottom: "32px" }}>
              {t('home.products.desc')}
            </p>
            <button type="button" className="btn btn-primary" onClick={() => window.location.href = "/products"}>
              {t('home.products.cta')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-[22px] max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1 mx-auto">
          {products.map((p) => (
            <article key={p.key} className="flex flex-col product-card group">
              <div className="flex flex-col">
                <div className="relative product-panel" style={{ aspectRatio: "4 / 5", background: "#0a0a0a", overflow: "hidden" }}>
                  <div className="absolute inset-0 flex items-center justify-center tech-panel" style={{ background: "radial-gradient(circle at center, rgba(216,163,90,0.12), transparent 70%)" }}>
                    <div className="text-center px-6">
                      <div className="text-[var(--amber)] text-[40px] mb-4 opacity-60 product-icon">
                        {p.icon}
                      </div>
                      <h3 className="text-[15px] tracking-[0.12em] uppercase font-bold mb-2">{p.name}</h3>
                      <p className="text-[var(--gray)] text-[11px] tracking-[0.16em] uppercase">{p.sub}</p>
                    </div>
                  </div>
                </div>
                <div style={{ paddingTop: "20px" }}>
                  <h3 className="text-[17px] mb-[8px]">{p.name}</h3>
                  <p className="text-[var(--gray)] text-[15px]" style={{ marginBottom: "6px" }}>{p.sub}</p>
                  <p className="text-[var(--gray)] text-[13px] leading-relaxed mt-3">{p.desc}</p>
                  <ul className="mt-4 space-y-1">
                    {p.specs.map((s, i) => (
                      <li key={i} className="text-[12px] text-[var(--gray)] flex items-start gap-2">
                        <span className="text-[var(--amber)] mt-0.5 shrink-0">•</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary product-cta"
                  style={{ marginTop: "24px", alignSelf: "flex-start" }}
                  onClick={() => window.location.href = `/products/${p.key}`}
                >
                  {t('home.products.learnMore')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Why Funing */}
      <section id="why-funing" className="scroll-mt-0 px-page bg-[#080808]" style={{
        paddingTop: "clamp(96px, 14vw, 160px)",
        paddingBottom: "clamp(96px, 14vw, 160px)"
      }}>
        <div className="text-center mb-[clamp(56px, 8vw, 88px)]">
          <p className="eyebrow text-center" style={{ marginBottom: "24px" }}>{t('home.why.eyebrow')}</p>
          <h2 className="section-title mx-auto" style={{
            fontSize: "clamp(32px,4.4vw,56px)",
            lineHeight: 1.1,
            letterSpacing: "0.06em",
            marginTop: 0,
            marginBottom: "clamp(56px, 8vw, 88px)",
            maxWidth: "780px",
            textAlign: "center",
            textTransform: "uppercase"
          }}>
            {t('home.why.title1')}{" "}
            <br className="hidden sm:block" />
            {t('home.why.title2')}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-[28px] max-[1000px]:grid-cols-1 max-[1000px]:gap-[20px] max-w-[1180px] mx-auto">
          {whyUs.map((c, i) => (
            <article key={c.num} className="animate-slide-up" style={{ animationDelay: `${i * 120}ms` }}>
              <div className="border-t border-[var(--line)] flex flex-col h-full" style={{ paddingTop: "28px" }}>
                <div className="text-[var(--gray)] text-[11px] tracking-[0.22em] uppercase" style={{ marginBottom: "28px" }}>
                  {c.num}
                </div>
                <h3 className="text-[20px] tracking-[0.06em] uppercase" style={{ marginBottom: "20px" }}>
                  {c.title}
                </h3>
                <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "14px" }}>
                  {c.bullets.map((b, bi) => (
                    <li key={bi} className="text-[var(--gray)] text-[16px] leading-[1.7]" style={{ position: "relative", paddingLeft: "18px" }}>
                      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: "10px", width: "6px", height: "6px", backgroundColor: "var(--amber, #d8a35a)", borderRadius: "999px" }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* OEM/ODM Services */}
      <section id="oem" className="scroll-mt-0 px-page bg-[#050505]" style={{
        paddingTop: "clamp(96px, 14vw, 160px)",
        paddingBottom: "clamp(96px, 14vw, 160px)"
      }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-[clamp(48px, 6vw, 72px)]">
            <p className="eyebrow" style={{ marginBottom: "24px", textAlign: "center" }}>{t('home.oem.eyebrow')}</p>
            <h2 className="section-title mx-auto" style={{
              fontSize: "clamp(32px,4.4vw,56px)",
              lineHeight: 1.1,
              letterSpacing: "0.06em",
              marginTop: 0,
              marginBottom: "clamp(16px, 2vw, 24px)",
              maxWidth: "820px",
              textAlign: "center",
              textTransform: "uppercase"
            }}>
              {t('home.oem.title')}
            </h2>
            <p className="body-text mx-auto" style={{ marginTop: 0, marginBottom: "clamp(48px, 6vw, 72px)", maxWidth: "560px", textAlign: "center" }}>
              {t('home.oem.desc')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-[20px] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
            {oemServices.map((svc) => (
              <div key={svc.title} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 hover:border-[var(--amber)] transition-colors">
                <h3 className="text-[15px] tracking-[0.08em] uppercase font-bold mb-3">{svc.title}</h3>
                <p className="text-[var(--gray)] text-[14px] leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center flex-wrap gap-[16px]" style={{ marginTop: "clamp(56px, 7vw, 88px)" }}>
            <button type="button" className="btn btn-primary" onClick={() => window.location.href = "/quote"}>
              {t('home.oem.cta1')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => window.location.href = "/contact"}>
              {t('home.oem.cta2')}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-0 px-page bg-[#050505]" style={{
        paddingTop: "clamp(96px, 14vw, 160px)",
        paddingBottom: "clamp(96px, 14vw, 160px)"
      }}>
        <div className="grid grid-cols-[0.8fr_1.2fr] gap-[80px] max-w-[1200px] mx-auto items-start max-[1000px]:grid-cols-1 max-[1000px]:gap-[40px]">
          <div className="max-[1000px]:!static" style={{ position: "sticky", top: "120px" }}>
            <p className="eyebrow" style={{ marginBottom: "24px" }}>{t('home.faq.eyebrow')}</p>
            <h2 className="section-title" style={{
              fontSize: "clamp(32px,4vw,52px)",
              lineHeight: 1.1,
              letterSpacing: "0.06em",
              marginBottom: "28px"
            }}>
              {t('home.faq.title')}
            </h2>
            <p className="text-[var(--gray)] leading-[1.7]" style={{ maxWidth: "360px", marginBottom: "32px" }}>
              {t('home.faq.desc')}
            </p>
            <button type="button" className="btn btn-secondary" onClick={() => window.location.href = "/contact"}>
              {t('home.faq.cta')}
            </button>
          </div>

          <div>
            {faq.map((item, i) => (
              <details key={item.q} className="group faq-item border-t border-[var(--line)]" style={{ paddingTop: "24px", paddingBottom: i === faq.length - 1 ? "0" : "24px" }}>
                <summary className="flex items-center justify-between cursor-pointer list-none" style={{ paddingRight: "32px" }}>
                  <span className="text-white font-medium text-[16px] leading-[1.4] pr-8">{item.q}</span>
                  <svg className="w-5 h-5 text-[var(--amber)] flex-shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="faq-panel">
                  <div className="text-[var(--gray)] leading-[1.7] mt-4" style={{ fontSize: "16px", paddingRight: "32px" }}>
                    {item.a}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-page text-center relative overflow-hidden" style={{
        paddingTop: "clamp(96px, 14vw, 160px)",
        paddingBottom: "clamp(96px, 14vw, 160px)"
      }}>
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/cta-bg.webp"
            alt=""
            fill
            className="object-cover object-center"
            priority={false}
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(rgba(5,5,5,0.78), rgba(5,5,5,0.9))" }} />
          {/* PCB-style texture overlay to match the electronics brand */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 50% 120%, rgba(216,163,90,0.12), transparent 55%), linear-gradient(rgba(216,163,90,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(216,163,90,0.04) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 44px 44px, 44px 44px",
            }}
          />
        </div>

        <div className="relative z-10">
          <p className="eyebrow" style={{ marginBottom: "32px" }}>{t('home.cta.eyebrow')}</p>
          <h2 className="section-title mx-auto" style={{
            fontSize: "clamp(40px,5.6vw,68px)",
            lineHeight: 1.1,
            letterSpacing: "0.04em",
            marginBottom: "28px"
          }}>
            {t('home.cta.title')}
          </h2>
          <p className="text-[var(--soft-white)] mx-auto" style={{ maxWidth: "620px", lineHeight: 1.6, marginBottom: "56px", textAlign: "center" }}>
            {t('home.cta.desc')}
          </p>
          <div className="flex justify-center items-center gap-[16px] flex-wrap">
            <button type="button" className="btn btn-primary" onClick={() => window.location.href = "/quote"}>
              {t('home.cta.btn1')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => window.location.href = "/contact"}>
              {t('home.cta.btn2')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
