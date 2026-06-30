import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

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

    // Save each key with UPSERT
    const keys = Object.keys(contents);
    console.log('[admin/content] Saving', keys.length, 'keys:', keys.join(', '));

    for (const key of keys) {
      const val = contents[key];
      const zh = (val && typeof val === 'object' && 'zh' in val) ? String(val.zh) : String(val || '');
      const en = (val && typeof val === 'object' && 'en' in val) ? String(val.en) : String(val || '');

      await env.DB.prepare(
        'INSERT INTO site_content (key, zh, en) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET zh = ?, en = ?'
      ).bind(key, zh, en, zh, en).run();
    }

    console.log('[admin/content] Saved', keys.length, 'keys successfully');
    console.log('[admin/content] Image keys saved:', keys.filter(k => k.includes('image'))
      .map(k => `${k}=${JSON.stringify(contents[k])}`).join(' | '));

    return NextResponse.json(
      { success: true, saved: keys.length },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('[admin/content] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
