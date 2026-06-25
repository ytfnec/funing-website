import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { translations } from '@/lib/i18n';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) throw new Error('No DB');

    const contentResult = await db.prepare('SELECT * FROM site_content').all();
    const newsResult = await db.prepare('SELECT * FROM news_article ORDER BY "order" ASC').all();

    const dbMap: Record<string, { zh: string; en: string }> = {};
    for (const c of contentResult.results || []) {
      dbMap[c.key] = { zh: c.zh, en: c.en };
    }

    const merged: Record<string, { zh: string; en: string }> = {};
    for (const key of Object.keys(translations.zh)) {
      merged[key] = dbMap[key] || {
        zh: translations.zh[key as keyof typeof translations.zh],
        en: translations.en[key as keyof typeof translations.en],
      };
    }

    return NextResponse.json(
      { contents: merged, news: newsResult.results || [], _t: Date.now() },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch {
    return NextResponse.json(
      {
        contents: Object.keys(translations.zh).reduce((acc, key) => {
          acc[key] = {
            zh: translations.zh[key as keyof typeof translations.zh],
            en: translations.en[key as keyof typeof translations.en],
          };
          return acc;
        }, {} as Record<string, { zh: string; en: string }>),
        news: [],
        _t: Date.now(),
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }
}
