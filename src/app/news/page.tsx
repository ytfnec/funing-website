'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowUpRight, FileText } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { NewsListSkeleton } from '@/components/Skeleton';
import type { NewsArticle } from '@/lib/news';

export default function NewsPage() {
  const { t } = useLang();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/news')
      .then((res) => (res.ok ? res.json() : { articles: [] }))
      .then((data) => {
        if (!cancelled) setArticles(data.articles || []);
      })
      .catch(() => {
        if (!cancelled) setArticles([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  return (
    <>
      {/* Hero */}
      <section className="px-page pt-[clamp(120px,16vw,200px)] pb-[clamp(60px,8vw,100px)] bg-cream">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="eyebrow mb-6">{t('news.hero.eyebrow')}</p>
          <h1 className="text-[clamp(40px,6vw,80px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-8">
            {t('news.hero.title')}
          </h1>
          <p className="body-text max-w-[600px] mx-auto">{t('news.hero.desc')}</p>
        </div>
      </section>

      {/* Listing */}
      <section className="px-page py-[clamp(60px,8vw,100px)] bg-sand min-h-[40vh]">
        <div className="max-w-[1100px] mx-auto">
          {loading ? (
            <NewsListSkeleton />
          ) : articles.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-10 h-10 text-[var(--gray)] mx-auto mb-4" />
              <p className="text-[var(--gray)]">{t('news.list.empty')}</p>
            </div>
          ) : (
            <div className="space-y-[clamp(40px,5vw,64px)]">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-[clamp(24px,4vw,48px)] items-center group"
                >
                  {/* Cover / placeholder */}
                  <Link href={`/news/${article.slug}`} className="block relative overflow-hidden">
                    <div className="aspect-[4/3] tech-panel bg-card overflow-hidden flex items-center justify-center">
                      {article.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <div className="text-[var(--amber)] text-[36px] mb-2 opacity-50">✦</div>
                          <div className="text-[var(--gray)] text-[11px] tracking-[0.2em] uppercase">
                            Funing Electronics
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-4 mb-3 text-[12px] text-[var(--gray)]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(article.published_at || article.created_at) || t('news.published')}
                      </span>
                      {article.author && (
                        <span>
                          {t('news.author')} {article.author}
                        </span>
                      )}
                    </div>
                    <h2 className="text-[clamp(24px,3vw,36px)] leading-[1.15] tracking-[0.04em] uppercase font-bold mb-3">
                      <Link href={`/news/${article.slug}`} className="hover:text-[var(--amber)] transition-colors">
                        {article.title}
                      </Link>
                    </h2>
                    {article.excerpt && (
                      <p className="text-[var(--soft-white)] text-[clamp(15px,1.1vw,17px)] leading-relaxed mb-5 max-w-[620px]">
                        {article.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/news/${article.slug}`}
                      className="inline-flex items-center gap-2 text-[12px] tracking-[0.16em] uppercase text-[var(--amber)] font-bold hover:text-ink transition-colors"
                    >
                      {t('news.readMore')}
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
