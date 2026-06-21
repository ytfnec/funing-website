import { NextResponse } from 'next/server';
import { translations } from '@/lib/i18n';

// Build static fallback map
function buildStaticMap() {
  const map: Record<string, { zh: string; en: string }> = {};
  for (const key of Object.keys(translations.zh)) {
    map[key] = {
      zh: translations.zh[key as keyof typeof translations.zh],
      en: translations.en[key as keyof typeof translations.en],
    };
  }
  return map;
}

const staticMap = buildStaticMap();

export async function GET() {
  try {
    // Try Cloudflare D1 first
    const { getDB } = await import('@/lib/cloudflare');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env?.DB) {
      const results = await env.DB.prepare('SELECT * FROM SiteContent').all();
      const contents = buildStaticMap();
      for (const row of results.results as Array<{ key: string; zh: string; en: string }>) {
        contents[row.key] = { zh: row.zh, en: row.en };
      }
      const newsResults = await env.DB.prepare('SELECT * FROM NewsArticle ORDER BY "order" ASC').all();
      return NextResponse.json({
        contents,
        news: newsResults.results,
      });
    }
  } catch {
    // Not in Cloudflare environment, try Prisma
  }

  try {
    const { db } = await import('@/lib/db');
    const dbContents = await db.siteContent.findMany();
    const contents = buildStaticMap();
    for (const c of dbContents) {
      contents[c.key] = { zh: c.zh, en: c.en };
    }
    const news = await db.newsArticle.findMany({ orderBy: { order: 'asc' } });
    return NextResponse.json({ contents, news });
  } catch {
    // Ultimate fallback to static
    return NextResponse.json({ contents: staticMap, news: [] });
  }
}
