'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { NewsArticleSkeleton } from '@/components/Skeleton';
import type { NewsArticle } from '@/lib/news';

export default function NewsArticlePage() {
  const { t } = useLang();
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    fetch(`/api/news/${encodeURIComponent(slug)}`)
      .then(async (res) => {
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return null;
        }
        if (!res.ok) return null;
        const data = await res.json();
        return data.article || null;
      })
      .then((a) => {
        if (!cancelled) {
          setArticle(a);
          setNotFound(!a);
        }
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  if (loading) {
    return <NewsArticleSkeleton />;
  }

  if (notFound || !article) {
    return (
      <section className="px-page pt-[clamp(120px,16vw,200px)] pb-[clamp(80px,10vw,140px)] bg-cream min-h-[70vh]">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="eyebrow mb-6">404</p>
          <h1 className="text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6">
            {t('news.notFound.title')}
          </h1>
          <p className="body-text max-w-[480px] mx-auto mb-10">{t('news.notFound.desc')}</p>
          <Link href="/news" className="btn btn-primary">
            <ArrowLeft className="w-4 h-4" /> {t('news.notFound.back')}
          </Link>
        </div>
      </section>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.cover_image || undefined,
    author: article.author
      ? { '@type': 'Person', name: article.author }
      : { '@type': 'Organization', name: 'Funing Electronics' },
    publisher: {
      '@type': 'Organization',
      name: 'Funing Electronics',
      url: 'https://fnec.net',
    },
    datePublished: article.published_at || article.created_at || undefined,
    dateModified: article.updated_at || article.published_at || article.created_at || undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://fnec.net/news/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fnec.net/' },
              { '@type': 'ListItem', position: 2, name: 'News', item: 'https://fnec.net/news' },
              { '@type': 'ListItem', position: 3, name: article.title, item: `https://fnec.net/news/${article.slug}` },
            ],
          }),
        }}
      />
      <section className="px-page pt-[clamp(120px,16vw,200px)] pb-[clamp(40px,5vw,72px)] bg-cream">
        <div className="max-w-[860px] mx-auto">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase text-[var(--gray)] hover:text-[var(--amber)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> {t('news.back')}
          </Link>

          <p className="eyebrow mb-5">{t('news.hero.eyebrow')}</p>
          <h1 className="text-[clamp(32px,5vw,56px)] leading-[1.1] tracking-[0.04em] uppercase font-bold mb-6">
            {article.title}
          </h1>

          <div className="flex items-center gap-5 text-[13px] text-[var(--gray)] mb-10">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(article.published_at || article.created_at)}
            </span>
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {t('news.author')} {article.author}
              </span>
            )}
          </div>
        </div>
      </section>

      {article.cover_image && (
        <section className="px-page bg-cream">
          <div className="max-w-[960px] mx-auto">
            <div className="aspect-[21/9] overflow-hidden rounded-lg border border-[rgba(32,29,23,0.06)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </section>
      )}

      <section className="px-page py-[clamp(48px,6vw,88px)] bg-sand">
        <div className="max-w-[860px] mx-auto">
          {article.content ? (
            <div className="prose text-[clamp(16px,1.2vw,18px)] leading-[1.85] text-[var(--soft-white)] whitespace-pre-line">
              {article.content}
            </div>
          ) : (
            article.excerpt && (
              <p className="body-text text-lg">{article.excerpt}</p>
            )
          )}
        </div>
      </section>
    </>
  );
}
