import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { translations } from '@/lib/i18n';

export async function GET() {
  try {
    // Fetch all content from database
    const contents = await db.siteContent.findMany();
    const news = await db.newsArticle.findMany({ orderBy: { order: 'asc' } });

    // Build content map from DB
    const dbMap: Record<string, { zh: string; en: string }> = {};
    for (const c of contents) {
      dbMap[c.key] = { zh: c.zh, en: c.en };
    }

    // Merge: start with i18n defaults, let DB override
    const merged: Record<string, { zh: string; en: string }> = {};
    for (const key of Object.keys(translations.zh)) {
      merged[key] = dbMap[key] || {
        zh: translations.zh[key as keyof typeof translations.zh],
        en: translations.en[key as keyof typeof translations.en],
      };
    }

    // CRITICAL FIX: Also include ALL DB keys that are NOT in i18n translations
    // (e.g. hero_bg_image, about_image, product_image_*, etc.)
    for (const key of Object.keys(dbMap)) {
      if (!(key in merged)) {
        merged[key] = dbMap[key];
      }
    }

    return new NextResponse(JSON.stringify({ contents: merged, news }), {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch {
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