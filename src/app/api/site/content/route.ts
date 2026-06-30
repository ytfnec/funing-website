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

    // 1. First, include ALL i18n translation keys with D1 overrides
    for (const key of Object.keys(translations.zh)) {
      merged[key] = dbMap[key] || {
        zh: translations.zh[key as keyof typeof translations.zh],
        en: translations.en[key as keyof typeof translations.en],
      };
    }

    // 2. Then, include ALL D1 keys that are NOT in i18n (e.g. hero_bg_image, about_image, etc.)
    for (const key of Object.keys(dbMap)) {
      if (!(key in merged)) {
        merged[key] = dbMap[key];
      }
    }

    return NextResponse.json(
      { contents: merged, news: newsResult.results || [] },
      { headers: { 'Cache-Control': 'no-store' } }
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
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
