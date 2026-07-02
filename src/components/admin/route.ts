import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { translations } from '@/lib/i18n';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });

    // Read ALL site_content from D1
    const contentRows = await env.DB.prepare('SELECT key, zh, en FROM site_content').all();
    const newsRows = await env.DB.prepare('SELECT * FROM NewsArticle ORDER BY "order" ASC').all();

    // Build content map from D1
    const dbMap: Record<string, { zh: string; en: string }> = {};
    for (const row of contentRows.results as Array<{ key: string; zh: string; en: string }>) {
      dbMap[row.key] = { zh: row.zh, en: row.en };
    }

    // Start with i18n defaults, override with D1 values
    const merged: Record<string, { zh: string; en: string }> = {};
    for (const key of Object.keys(translations.zh)) {
      merged[key] = dbMap[key] || {
        zh: (translations.zh as Record<string, string>)[key],
        en: (translations.en as Record<string, string>)[key],
      };
    }

    // Add D1-only keys (e.g. hero_bg_image saved from admin panel)
    for (const key of Object.keys(dbMap)) {
      if (!(key in merged)) merged[key] = dbMap[key];
    }

    return NextResponse.json(
      { contents: merged, news: newsRows.results || [] },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    return NextResponse.json(
      {
        contents: Object.keys(translations.zh).reduce((acc, key) => {
          acc[key] = {
            zh: (translations.zh as Record<string, string>)[key] || '',
            en: (translations.en as Record<string, string>)[key] || '',
          };
          return acc;
        }, {} as Record<string, { zh: string; en: string }>),
        news: [],
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
