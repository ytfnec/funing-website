'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { resolveImageSrc } from '@/lib/image';
import { ArrowRight, Check, Shield, Clock, Zap, Package } from 'lucide-react';
import { ProductDetailSkeleton } from '@/components/Skeleton';

interface Product {
  id: string;
  slug: string;
  name: string;
  sub_title: string;
  price_range: string;
  category: string;
  short_description: string;
  long_description: string;
  hero_image: string;
  features: string;
  specifications: string;
  warranty_info: string;
  installation_info: string;
  electrical_requirements: string;
  lead_time: string;
  in_stock: number;
}

// Fallback content for the 4 known product lines (used when D1 has
// partial data or isn't seeded yet). Comes from i18n so it's localized.
function useFallbackProduct(slug: string) {
  const { t } = useLang();

  const fallbacks: Record<string, Product> = {
    'sauna-controllers': {
      id: 'fallback-sauna-controllers',
      slug,
      name: t('p.saunaControllers.name'),
      sub_title: t('p.saunaControllers.sub'),
      price_range: t('prod.price.sample'),
      category: 'sauna-control',
      short_description: t('p.saunaControllers.desc'),
      long_description: '',
      hero_image: '',
      features: '',
      specifications: '',
      warranty_info: '',
      installation_info: '',
      electrical_requirements: '',
      lead_time: '',
      in_stock: 1,
    },
    'jacquard-drivers': {
      id: 'fallback-jacquard-drivers',
      slug,
      name: t('p.jacquard.name'),
      sub_title: t('p.jacquard.sub'),
      price_range: t('prod.price.volume'),
      category: 'industrial-control',
      short_description: t('p.jacquard.desc'),
      long_description: '',
      hero_image: '',
      features: '',
      specifications: '',
      warranty_info: '',
      installation_info: '',
      electrical_requirements: '',
      lead_time: '',
      in_stock: 1,
    },
    'branded-units': {
      id: 'fallback-branded-units',
      slug,
      name: t('p.branded.name'),
      sub_title: t('p.branded.sub'),
      price_range: t('prod.price.wholesale'),
      category: 'sauna-control',
      short_description: t('p.branded.desc'),
      long_description: '',
      hero_image: '',
      features: '',
      specifications: '',
      warranty_info: '',
      installation_info: '',
      electrical_requirements: '',
      lead_time: '',
      in_stock: 1,
    },
    accessories: {
      id: 'fallback-accessories',
      slug,
      name: t('p.accessories.name'),
      sub_title: t('p.accessories.sub'),
      price_range: t('prod.price.bulk'),
      category: 'components',
      short_description: t('p.accessories.desc'),
      long_description: '',
      hero_image: '',
      features: '',
      specifications: '',
      warranty_info: '',
      installation_info: '',
      electrical_requirements: '',
      lead_time: '',
      in_stock: 1,
    },
  };

  return fallbacks[slug] || null;
}

// Parse a features/specifications field that may be JSON array, newline-separated,
// or comma-separated. Falls back to an empty list.
function parseList(raw: string | undefined | null): string[] {
  if (!raw) return [];
  const trimmed = raw.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((x) => typeof x === 'string' && x.trim());
    }
  } catch {
    // Not JSON — fall through to line/comma split
  }
  return trimmed
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((s) => (s.includes(',') ? s.split(',').map((x) => x.trim()) : [s]))
    .filter(Boolean);
}

const ICONS: Record<string, typeof Zap> = {
  'sauna-controllers': Zap,
  'jacquard-drivers': Package,
  'branded-units': Shield,
  accessories: Package,
};

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLang();
  const fallback = useFallbackProduct(slug);

  const [product, setProduct] = useState<Product | null>(fallback);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(fallback ? false : true);
  // Track hero-image load failures so we can fall back to the placeholder
  // texture when the stored image is missing/broken.
  const [heroFailed, setHeroFailed] = useState(false);
  const heroImage = resolveImageSrc(product?.hero_image);

  useEffect(() => {
    setHeroFailed(false);
  }, [heroImage]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (res.status === 404) {
          if (!cancelled) {
            setNotFound(true);
            setLoading(false);
          }
          return;
        }
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (!cancelled) {
          // Merge API data over fallback so partial DB rows still render richly.
          setProduct((prev) => ({ ...(prev || ({} as Product)), ...data.product }));
          setNotFound(false);
        }
      } catch {
        // Keep fallback content; don't treat as 404 for known slugs.
        if (!cancelled && !fallback) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug, fallback]);

  // Dynamic SEO metadata + Product JSON-LD (client-side since page uses useLang).
  useEffect(() => {
    if (!product?.name) return;
    const desc = product.long_description || product.short_description || 'Funing Electronics product.';

    document.title = `${product.name} | Funing Electronics`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);

    // Open Graph / Twitter
    const setMeta = (selector: string, attr: string, value: string) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const parts = selector.replace('meta[', '').replace(']', '').split('=');
        el.setAttribute(parts[0], parts[1].replace(/"/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    setMeta('meta[property="og:title"]', 'content', `${product.name} | Funing Electronics`);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[name="twitter:title"]', 'content', `${product.name} | Funing Electronics`);
    setMeta('meta[name="twitter:description"]', 'content', desc);
  }, [product]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (notFound || !product) {
    return (
      <section className="px-page py-32 text-center bg-[#050505] min-h-[60vh] flex flex-col items-center justify-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-[clamp(32px,4vw,52px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6">
          Product Not Found
        </h1>
        <p className="body-text mb-10 max-w-[420px]">
          The product you&apos;re looking for doesn&apos;t exist or is no longer available.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/products" className="btn btn-primary">← All Products</Link>
          <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
        </div>
      </section>
    );
  }

  const features = parseList(product.features).length > 0
    ? parseList(product.features)
    : fallback
      ? [t('p.saunaControllers.spec1'), t('p.saunaControllers.spec2'), t('p.saunaControllers.spec3'), t('p.saunaControllers.spec4')].filter(Boolean)
      : [];
  const specs = parseList(product.specifications);
  const Icon = ICONS[slug] || Package;

  return (
    <>
      {/* Hero */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#050505]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: product.name,
              description: product.long_description || product.short_description || undefined,
              image: heroImage || undefined,
              brand: { '@type': 'Brand', name: 'Funing Electronics' },
              manufacturer: {
                '@type': 'Organization',
                name: 'Yantai Funing Electronics Co., Ltd.',
              },
              // Omit the offers block entirely when price_range is prose
              // (no parseable numeric price), to avoid invalid Offer markup.
              ...(product.price_range
                ? {
                    offers: {
                      '@type': 'Offer',
                      priceCurrency: 'USD',
                      price: '0', // contact for pricing
                      availability: product.in_stock === 1
                        ? 'https://schema.org/InStock'
                        : 'https://schema.org/OutOfStock',
                    },
                  }
                : {}),
            }),
          }}
        />
        <div className="max-w-[1280px] mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 text-[12px] tracking-[0.12em] uppercase text-[var(--gray)]">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li aria-hidden="true" className="text-[var(--gray)]/50">/</li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  {t('nav.products')}
                </Link>
              </li>
              <li aria-hidden="true" className="text-[var(--gray)]/50">/</li>
              <li aria-current="page" className="text-[var(--amber)]">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)] items-center">
            <div>
              {product.sub_title && (
                <p className="text-[11px] tracking-[0.24em] uppercase text-[var(--amber)] mb-4">
                  {product.sub_title}
                </p>
              )}
              <h1 className="text-[clamp(40px,6vw,68px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-6">
                {product.name}
              </h1>
              <p className="body-text mb-8">
                {product.long_description || product.short_description}
              </p>

              {product.price_range && (
                <div className="flex items-center gap-6 flex-wrap mb-8">
                  <span className="text-[clamp(20px,2vw,28px)] font-medium" style={{ color: 'var(--wood)' }}>
                    {product.price_range}
                  </span>
                  {product.in_stock === 1 && (
                    <span className="px-2 py-1 rounded-full text-[10px] tracking-[0.14em] uppercase bg-[rgba(52,211,153,0.2)] text-green-400">
                      In Stock
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-4 flex-wrap">
                <Link href={`/quote?product=${product.slug}`} className="btn btn-primary">
                  Get a Quote <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Talk to an Engineer
                </Link>
              </div>
            </div>

            {/* Visual panel: real hero image when available, otherwise the
                amber grid placeholder texture (kept as a graceful fallback). */}
            <div className="aspect-[4/3] bg-[#0a0a0a] rounded-lg overflow-hidden relative border border-[rgba(255,255,255,0.06)]">
              {heroImage && !heroFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={heroImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  onError={() => setHeroFailed(true)}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background: "radial-gradient(circle at center, rgba(216,163,90,0.10), transparent 70%), linear-gradient(rgba(216,163,90,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(216,163,90,0.04) 1px, transparent 1px)",
                    backgroundSize: "100% 100%, 32px 32px, 32px 32px",
                  }}
                >
                  <div className="text-center p-8">
                    <Icon className="w-16 h-16 text-[var(--amber)] opacity-60 mx-auto mb-4" />
                    <div className="text-[var(--gray)] text-[12px] tracking-[0.2em] uppercase">
                      {product.name}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features & Specs */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)]">
          <div>
            <h2 className="text-[clamp(24px,3vw,36px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6">
              Key Features
            </h2>
            {features.length > 0 ? (
              <ul className="space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[var(--amber)] mt-0.5 flex-shrink-0" />
                    <span className="text-[15px] text-[var(--soft-white)] leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--gray)]">Detailed specifications available on request.</p>
            )}
          </div>

          <div>
            <h2 className="text-[clamp(24px,3vw,36px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6">
              Specifications
            </h2>
            {specs.length > 0 ? (
              <ul className="space-y-3">
                {specs.map((s) => (
                  <li key={s} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--amber)] mt-2 flex-shrink-0" />
                    <span className="text-[15px] text-[var(--soft-white)] leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--gray)]">Contact our team for the full technical datasheet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Additional info */}
      {(product.warranty_info || product.installation_info || product.electrical_requirements || product.lead_time) && (
        <section className="px-page py-[clamp(48px,6vw,80px)] bg-[#050505]">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.warranty_info && (
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
                <Shield className="w-5 h-5 text-[var(--amber)] mb-3" />
                <h3 className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2">Warranty</h3>
                <p className="text-[var(--gray)] text-sm leading-relaxed">{product.warranty_info}</p>
              </div>
            )}
            {product.electrical_requirements && (
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
                <Zap className="w-5 h-5 text-[var(--amber)] mb-3" />
                <h3 className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2">Electrical</h3>
                <p className="text-[var(--gray)] text-sm leading-relaxed">{product.electrical_requirements}</p>
              </div>
            )}
            {product.lead_time && (
              <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
                <Clock className="w-5 h-5 text-[var(--amber)] mb-3" />
                <h3 className="text-[13px] tracking-[0.14em] uppercase font-bold mb-2">Lead Time</h3>
                <p className="text-[var(--gray)] text-sm leading-relaxed">{product.lead_time}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808] text-center">
        <h2 className="text-[clamp(28px,3.5vw,42px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6 max-w-[600px] mx-auto">
          Ready to Order {product.name}?
        </h2>
        <p className="body-text max-w-[560px] mx-auto mb-10">
          Our team is available to answer questions, provide detailed pricing, and help you place an order.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href={`/quote?product=${product.slug}`} className="btn btn-primary">
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
