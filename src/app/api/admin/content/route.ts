import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { translations } from '@/lib/i18n';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function PATCH(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });
    const body = await request.json();
    const contents = body.contents;

    if (!contents || typeof contents !== 'object') {
      return NextResponse.json({ error: 'contents object required' }, { status: 400 });
    }

    const keys = Object.keys(contents);

    for (const key of keys) {
      const val = contents[key];
      const zh = (val && typeof val === 'object' && 'zh' in val) ? String(val.zh) : String(val || '');
      const en = (val && typeof val === 'object' && 'en' in val) ? String(val.en) : String(val || '');

      await env.DB.prepare(
        'INSERT INTO site_content (key, zh, en) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET zh = ?, en = ?'
      ).bind(key, zh, en, zh, en).run();
    }

    return NextResponse.json(
      { success: true, saved: keys.length },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('[admin/content] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

// GET: Read all content from D1, returning the SAME format as site/content was supposed to
export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });

    // Read site_content from D1
    const contentRows = await env.DB.prepare(
      'SELECT key, zh, en FROM site_content'
    ).all();

    // Build content map from D1
    const dbMap: Record<string, { zh: string; en: string }> = {};
    for (const row of (contentRows.results || []) as Array<{ key: string; zh: string; en: string }>) {
      dbMap[row.key] = { zh: row.zh, en: row.en };
    }

    // Merge: start with i18n defaults, let D1 override
    const merged: Record<string, { zh: string; en: string }> = {};
    for (const key of Object.keys(translations.zh)) {
      merged[key] = dbMap[key] || {
        zh: (translations.zh as Record<string, string>)[key] || '',
        en: (translations.en as Record<string, string>)[key] || '',
      };
    }

    // Add D1-only keys (image URLs from admin panel)
    for (const key of Object.keys(dbMap)) {
      if (!(key in merged)) {
        merged[key] = dbMap[key];
      }
    }

    return NextResponse.json(
      { contents: merged },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('[admin/content] GET Error:', error);
    return NextResponse.json(
      {
        contents: Object.keys(translations.zh).reduce((acc, key) => {
          acc[key] = {
            zh: (translations.zh as Record<string, string>)[key] || '',
            en: (translations.en as Record<string, string>)[key] || '',
          };
          return acc;
        }, {} as Record<string, { zh: string; en: string }>),
      },
      { headers: NO_CACHE_HEADERS }
    );
  }
}
