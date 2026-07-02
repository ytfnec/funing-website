import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { translations } from '@/lib/i18n';

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });

    // Fetch all content from D1
    const contentResult = await env.DB.prepare(
      'SELECT key, zh, en FROM site_content'
    ).all();

    // Fetch news from D1
    const newsResult = await env.DB.prepare(
      'SELECT * FROM NewsArticle ORDER BY "order" ASC'
    ).all();

    // Build content map from D1
    const dbMap: Record<string, { zh: string; en: string }> = {};
    for (const row of (contentResult.results || []) as Array<{ key: string; zh: string; en: string }>) {
      dbMap[row.key] = { zh: row.zh, en: row.en };
    }

    // Merge: start with i18n defaults, let DB override
    const merged: Record<string, { zh: string; en: string }> = {};
    for (const key of Object.keys(translations.zh)) {
      merged[key] = dbMap[key] || {
        zh: translations.zh[key as keyof typeof translations.zh],
        en: translations.en[key as keyof typeof translations.en],
      };
    }

    // CRITICAL: Also include ALL D1 keys that are NOT in i18n translations
    // (e.g. hero_bg_image, about_image, product_image_*, etc.)
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
    console.error('[site/content] Error:', err);
    // Fallback to static translations
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
