import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
  'Surrogate-Control': 'no-store',
};

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${file.name.split('.').pop()}`;
    const arrayBuffer = await file.arrayBuffer();

    // Upload to R2
    await env.STORAGE.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    const url = `/api/admin/proxy-image?file=${encodeURIComponent(filename)}`;

    // Save metadata to D1
    await env.DB.prepare(
      'INSERT INTO uploaded_images (filename, url, category) VALUES (?, ?, ?)'
    ).bind(filename, url, category).run();

    console.log('[admin/upload] Uploaded:', filename, '->', url);

    return NextResponse.json(
      { success: true, url, filename, category },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('[admin/upload] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });

    const rows = await env.DB.prepare(
      'SELECT id, filename, url, category, created_at FROM uploaded_images ORDER BY created_at DESC LIMIT 50'
    ).all();

    console.log('[admin/upload] Returning', (rows.results || []).length, 'images');

    return NextResponse.json(
      { images: rows.results || [] },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error) {
    console.error('[admin/upload] GET Error:', error);
    return NextResponse.json({ images: [] }, { headers: NO_CACHE_HEADERS });
  }
}
