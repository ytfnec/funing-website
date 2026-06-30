import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getTranslations } from '@/lib/i18n';

export const runtime = 'edge';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });

    // 1. Get all content from D1
    const dbRows = await env.DB.prepare(
      'SELECT key, zh, en FROM site_content'
    ).all();

    // Build D1 map: key -> { zh, en }
    const dbMap: Record<string, { zh: string; en: string }> = {};
    if (dbRows.results) {
      for (const row of dbRows.results as any[]) {
        dbMap[row.key] = {
          zh: row.zh || '',
          en: row.en || '',
        };
      }
    }

    // 2. Get i18n defaults
    const translations = getTranslations();
    const staticMap: Record<string, { zh: string; en: string }> = {};

    // Build from zh translations
    for (const [key, val] of Object.entries(translations.zh)) {
      staticMap[key] = {
        zh: typeof val === 'string' ? val : String(val),
        en: (translations.en as any)[key] || '',
      };
    }

    // 3. Merge: D1 values OVERRIDE static defaults (D1 is source of truth)
    const merged: Record<string, { zh: string; en: string }> = {};
    // Start with static defaults
    for (const [key, val] of Object.entries(staticMap)) {
      merged[key] = { ...val };
    }
    // Overlay D1 values (this overwrites static defaults with DB values)
    for (const [key, val] of Object.entries(dbMap)) {
      merged[key] = { ...val };
    }

    // 4. Get news articles from D1
    const newsRows = await env.DB.prepare(
      'SELECT * FROM news_article ORDER BY created_at DESC'
    ).all();
    const news = newsRows.results || [];

    // 5. Return with consistent structure - wrapped in { contents: ..., news: ... }
    const response = {
      contents: merged,
      news: news,
    };

    console.log('[site/content] Returning', Object.keys(merged).length, 'content keys, including:', 
      Object.keys(merged).filter(k => k.includes('image')).join(', ') || 'no image keys');

    return NextResponse.json(response, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('[site/content] Error:', error);
    // Even on error, return static defaults wrapped in contents
    const translations = getTranslations();
    const staticMap: Record<string, { zh: string; en: string }> = {};
    for (const [key, val] of Object.entries(translations.zh)) {
      staticMap[key] = {
        zh: typeof val === 'string' ? val : String(val),
        en: (translations.en as any)[key] || '',
      };
    }
    return NextResponse.json(
      { contents: staticMap, news: [] },
      { headers: NO_CACHE_HEADERS }
    );
  }
}