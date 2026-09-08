'use client';

import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

  // FAQPage structured data — gives Google a chance to show rich FAQ results
  // in search, driven by the same copy rendered in the FAQ section.
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq
      .filter((f) => f.q && f.a)
      .map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
  };

  const clientLogos = [
    { src: '/assets/client-logos/axis.png', alt: 'AXIS', h: 36, maxW: 230 },
    { src: '/assets/client-logos/newgen.png', alt: 'NEWGEN', h: 36, maxW: 230 },
    { src: '/assets/client-logos/healthmate.png', alt: 'Health Mate', h: 28, maxW: 300 },
    { src: '/assets/client-logos/beem.png', alt: 'Beem', h: 63, maxW: 320 },
    { src: '/assets/client-logos/finnmark.svg', alt: 'Finnmark Designs', h: 34, maxW: 240 },
    { src: '/assets/client-logos/symmetry.svg', alt: 'Symmetry', mark: '/assets/client-logos/symmetry-mark.png', h: 30, maxW: 220 },
  ];

  const logoScrollRef = useRef<HTMLDivElement>(null);
  const scrollLogos = (dir: number) => {
    logoScrollRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] min-h-[calc(100vh-84px)] flex items-center justify-center overflow-hidden bg-[#15120e]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/hero-1920.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            decoding="async"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAOCAIAAAC6mkspAAACs0lEQVR42iXGWXLcVBQA0Ds9PUndie0kxkMBa6YqC2BJ8E1RwSFhSFyOB0mtN9yBD87XwZ/f/4SERBiI+P8QEXnI45t3l9e3N+M8Pz4//fHp493Huw93Hz59/nPbXoQEPEo9lV6QgEXk/rdfmBCZNFCBHAWQAzmN43J1DbqdX7wptUDZ2C2zTDlrH8LDwUlowIGYWVgefv9VhCVRB94jNRgckwVJ4vbtr7T93d699cCy7va4UCuTJJhfBYS5mk+IxCJIJKf1ZczMkCRlRgpARTJz2k/9/mlr/6SvE6AsBV92qMazTOeX5zwkNY2AnMchT0golkYYeDgMw+EgfEbxqsAQteb6cNCHtDxABXXei6x9tOny/Pb66vsf8zztpUTA2fnF67NzSUk8j5EJxszTlNIh4VnEEEMZeZ/60wF9Yiuhbto74zGdXby7uf0hjePy8hwel1dX313djPMsGzkgotleW/fapAQhggUj0zDm6ZCMWiSN6OiATqQAodZ6j/CuqmEOKI/W9k7rSbGqkoYUkiweEUVHpDEPY6g4b2rhy2n98vXfSETEp20BgKWsj9vTOB/l5NEstqbuqlGDVgJOTiHwFmidcHAuYdWtdn0uT+Xz3bf1AQF6r0g43R+m43HIk0AaglExPEzdrPXo0A1XkUdKX5hr59b9effavWvXZam9eKhaAwp+YcqDJBGZEjMhoptRU20aFsmQnGqNl81dwyz2BhgypUnGo+RUrTj0blW7Q5ywoQRrsBAxEUFIOFLAiDwTzhIzw4RgBAemYxZJc359wXNe26JrbaWYqzcLdCl1JRLhgUDCw9wBEBlH4Vc53oxwTGEeXWPpBELC6ODN+t7rXot6C1MLlbJvgJJYE2cIVA02zEQANDBODLOAGowMCQPceivFYjk9r+uy15OZhqm7/Qei4+K2C+892QAAAABJRU5ErkJggg=="
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 62% 55% at 50% 50%, rgba(16,13,10,0.48) 0%, rgba(16,13,10,0.16) 55%, rgba(16,13,10,0.04) 75%)" }} />
        </div>

        <div className="relative z-10 px-page max-w-[1000px] mx-auto text-ivory">
          <div className="flex flex-col items-center max-[1000px]:flex max-[1000px]:flex-col max-[1000px]:h-full max-[1000px]:justify-center text-center max-[1000px]:px-4 animate-fade-in">
            <div className="w-full max-w-[620px] mb-[clamp(40px,9vw,56px)]">
              <p className="eyebrow mb-6 text-[#d8b47c]" style={{ marginTop: 0, marginBottom: "24px" }}>
                {t('home.hero.eyebrow')}
              </p>
              <h1 className="section-title text-ivory" style={{ marginTop: 0, marginBottom: "24px" }}>
                {t('home.hero.title1')}{" "}
                <span className="tracking-[0.04em]">{t('home.hero.title2')}</span>
              </h1>
              <p className="body-text text-ivory/90" style={{ marginTop: 0, marginBottom: "clamp(40px, 9vw, 56px)", maxWidth: "560px" }}>
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
                className="btn btn-secondary btn-on-dark"
                onClick={() => window.location.href = "/contact"}
              >
                {t('home.hero.ctaContact')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="px-page py-[clamp(56px,7vw,96px)] bg-cream border-b border-[rgba(23,23,23,0.06)]">
        <div className="max-w-[1200px] mx-auto">
          <p className="eyebrow text-center" style={{ marginBottom: '14px' }}>{t('home.clientLogos.eyebrow')}</p>
          <h3 className="text-center text-[clamp(20px,2.4vw,28px)] font-bold tracking-[0.02em] mb-10 text-ink">
            {t('home.clientLogos.title')}
          </h3>
          <div className="relative">
            <button
              type="button"
              aria-label="Previous logos"
              onClick={() => scrollLogos(-1)}
              className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[rgba(23,23,23,0.12)] shadow-[0_6px_16px_rgba(23,23,23,0.08)] text-[#171717] hover:border-[#171717] flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div
              ref={logoScrollRef}
              className="flex items-center gap-5 overflow-x-auto px-4 py-1 scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {clientLogos.map((logo) => (
                <div
                  key={logo.alt}
                  className="bg-white border border-[rgba(23,23,23,0.08)] rounded-xl h-[84px] px-8 flex-shrink-0 flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {logo.mark && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo.mark}
                      alt=""
                      style={{ height: 48, width: 48 }}
                      className="object-contain flex-shrink-0 mr-3"
                    />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    loading="lazy"
                    style={{ height: logo.h, maxWidth: logo.maxW }}
                    className="w-auto object-contain"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-label="Next logos"
              onClick={() => scrollLogos(1)}
              className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[rgba(23,23,23,0.12)] shadow-[0_6px_16px_rgba(23,23,23,0.08)] text-[#171717] hover:border-[#171717] flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section id="products" className="scroll-mt-0 px-page bg-gradient-to-b from-[#fcfbf8] to-[#e5dac9]" style={{
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
                <div className="relative product-panel" style={{ aspectRatio: "4 / 5", background: "#ffffff", overflow: "hidden" }}>
                  <div className="absolute inset-0 flex items-center justify-center tech-panel" style={{ background: "radial-gradient(circle at center, rgba(111,90,65,0.12), transparent 70%)" }}>
                    <div className="text-center px-6">
                      <div className="text-[var(--amber)] text-[40px] mb-4 opacity-60 product-icon">
                        {p.icon}
                      </div>
                      <h3 className="text-[15px] tracking-[0.12em] uppercase font-bold mb-2">{p.name}</h3>
                      {p.sub && (
                        <p className="text-[var(--gray)] text-[11px] tracking-[0.16em] uppercase">{p.sub}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ paddingTop: "20px" }}>
                  <h3 className="text-[17px] mb-[8px]">{p.name}</h3>
                  {p.sub && (
                    <p className="text-[var(--gray)] text-[15px]" style={{ marginBottom: "6px" }}>{p.sub}</p>
                  )}
                  <p className="text-[var(--gray)] text-[13px] leading-relaxed mt-3">{p.desc}</p>
                  <ul className="mt-4 space-y-1">
                    {p.specs.filter(Boolean).map((s, i) => (
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
      <section id="why-funing" className="scroll-mt-0 px-page bg-sand" style={{
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
                      <span aria-hidden="true" style={{ position: "absolute", left: 0, top: "10px", width: "6px", height: "6px", backgroundColor: "var(--amber, #6f5a41)", borderRadius: "999px" }} />
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
      <section id="oem" className="scroll-mt-0 px-page bg-cream" style={{
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
              <div key={svc.title} className="bg-card border border-[rgba(23,23,23,0.06)] rounded-lg p-6 hover:border-[var(--amber)] transition-colors">
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
      <section id="faq" className="scroll-mt-0 px-page bg-cream" style={{
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
                  <span className="text-ink font-medium text-[16px] leading-[1.4] pr-8">{item.q}</span>
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
      <section className="px-page relative overflow-hidden text-center text-ivory" style={{
        paddingTop: "clamp(96px, 14vw, 160px)",
        paddingBottom: "clamp(96px, 14vw, 160px)"
      }}>
        <Image
          src="/assets/cta-bg.webp"
          alt=""
          fill
          priority={false}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Soft radial scrim keeps the centered call-to-action readable on a bright photo */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(16,13,10,0.5) 0%, rgba(16,13,10,0.2) 60%, rgba(16,13,10,0.06) 80%)" }} />
        <div className="relative z-10 max-w-[720px] mx-auto">
          <p className="eyebrow text-[#e8bb77]" style={{ marginBottom: "32px" }}>{t('home.cta.eyebrow')}</p>
          <h2 className="section-title mx-auto text-ivory" style={{
            fontSize: "clamp(40px,5.6vw,68px)",
            lineHeight: 1.1,
            letterSpacing: "0.04em",
            marginBottom: "28px"
          }}>
            {t('home.cta.title')}
          </h2>
          <p className="text-ivory/90 mx-auto" style={{ maxWidth: "620px", lineHeight: 1.6, marginBottom: "56px", textAlign: "center", fontSize: "17px" }}>
            {t('home.cta.desc')}
          </p>
          <div className="flex justify-center items-center gap-[16px] flex-wrap">
            <button type="button" className="btn btn-primary" onClick={() => window.location.href = "/quote"}>
              {t('home.cta.btn1')}
            </button>
            <button type="button" className="btn btn-secondary btn-on-dark" onClick={() => window.location.href = "/contact"}>
              {t('home.cta.btn2')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
