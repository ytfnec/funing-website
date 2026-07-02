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

    if (!env?.DB) {
      return NextResponse.json({ error: 'D1 binding DB not available — check Cloudflare Dashboard bindings' }, { status: 500, headers: NO_CACHE_HEADERS });
    }

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

      console.log(`[admin/content] Writing key="${key}" zh="${zh.slice(0, 50)}" en="${en.slice(0, 50)}"`);

      await env.DB.prepare(
        'INSERT INTO site_content (key, zh, en) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET zh = ?, en = ?'
      ).bind(key, zh, en, zh, en).run();
    }

    console.log('[admin/content] Saved', keys.length, 'keys successfully');

    // Verify: read back the keys we just saved
    const verifyResult = await env.DB.prepare(
      'SELECT key, zh, en FROM site_content WHERE key IN (' + keys.map(() => '?').join(',') + ')'
    ).bind(...keys).all();

    console.log('[admin/content] Verify read-back:', JSON.stringify(verifyResult.results));

    return NextResponse.json(
      { success: true, saved: keys.length, verify: verifyResult.results },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('[admin/content] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

// NEW: GET handler to read content directly from D1 (for diagnostics)
export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });

    if (!env?.DB) {
      return NextResponse.json({ error: 'D1 binding DB not available' }, { status: 500 });
    }

    const result = await env.DB.prepare(
      'SELECT key, zh, en FROM site_content ORDER BY key'
    ).all();

    return NextResponse.json({
      count: (result.results || []).length,
      rows: result.results || [],
    }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    console.error('[admin/content] GET Error:', error);
    return NextResponse.json({ error: String(error), rows: [] }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
