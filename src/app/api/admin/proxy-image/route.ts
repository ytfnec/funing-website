import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/cloudflare';

// Proxy R2 images to avoid CORS issues
export async function GET(request: NextRequest) {
  try {
    const file = request.nextUrl.searchParams.get('file');
    if (!file) return NextResponse.json({ error: 'No file specified' }, { status: 400 });

    const env = getEnv(request);
    if (!env.STORAGE) {
      return NextResponse.json({ error: 'Storage not available' }, { status: 404 });
    }

    const object = await env.STORAGE.get(file);
    if (!object) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'image/png');
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, { headers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
