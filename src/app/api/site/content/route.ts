import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { translations } from '@/lib/i18n';

// CRITICAL: Force dynamic rendering — this route MUST hit D1 on every request
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });

    if (!env?.DB) {
      console.error('[site/content] D1 binding not available');
      throw new Error('D1 binding not available');
    }

    // Fetch all content from D1
    const contentResult = await env.DB.prepare(
      'SELECT key, zh, en FROM site_content'
    ).all();

    console.log('[site/content] D1 returned', (contentResult.results || []).length, 'content rows');

    // Fetch news from D1
    const newsResult = await env.DB.prepare(
      'SELECT * FROM NewsArticle ORDER BY "order" ASC'
    ).all();

    console.log('[site/content] D1 returned', (newsResult.results || []).length, 'news rows');

    // Build content map from D1
    const dbMap: Record<string, { zh: string; en: string }> = {};
    for (const row of (contentResult.results || []) as Array<{ key: string; zh: string; en: string }>) {
      dbMap[row.key] = { zh: row.zh, en: row.en };
    }

    // Merge: start with i18n defaults, let D1 override
    const merged: Record<string, { zh: string; en: string }> = {};
    for (const key of Object.keys(translations.zh)) {
      merged[key] = dbMap[key] || {
        zh: translations.zh[key as keyof typeof translations.zh],
        en: translations.en[key as keyof typeof translations.en],
      };
    }

    // Include ALL D1 keys that are NOT in i18n translations
    for (const key of Object.keys(dbMap)) {
      if (!(key in merged)) {
        merged[key] = dbMap[key];
      }
    }

    return NextResponse.json(
      { contents: merged, news: newsResult.results || [] },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (err) {
    console.error('[site/content] Error — falling back to static translations:', err);
    return NextResponse.json({
      contents: Object.keys(translations.zh).reduce((acc, key) => {
        acc[key] = {
          zh: translations.zh[key as keyof typeof translations.zh],
          en: translations.en[key as keyof typeof translations.en],
        };
        return acc;
      }, {} as Record<string, { zh: string; en: string }>),
      news: [],
    });
  }
}
