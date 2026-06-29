import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function GET(request: NextRequest) {
  try {
    const file = new URL(request.url).searchParams.get('file');
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
    if (file.includes('..') || file.includes('/') || file.includes('\\')) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }
    const { env } = await getCloudflareContext({ request });
    if (!env.STORAGE) return NextResponse.json({ error: 'No storage' }, { status: 500 });
    const object = await env.STORAGE.get(file);
    if (!object) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=86400');
    headers.set('Access-Control-Allow-Origin', '*');
    return new Response(object.body, { headers });
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
