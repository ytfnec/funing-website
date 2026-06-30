import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ request });
    const { searchParams } = new URL(request.url);
    const file = searchParams.get('file');

    if (!file) {
      return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
    }

    // Path traversal protection
    const decodedFile = decodeURIComponent(file);
    if (decodedFile.includes('..') || decodedFile.includes('/') || decodedFile.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Only allow safe characters
    if (!/^[\w.-]+$/.test(decodedFile)) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    const object = await env.STORAGE.get(decodedFile);
    if (!object) {
      console.warn('[proxy-image] File not found:', decodedFile);
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
    headers.set('Cache-Control', 'public, max-age=86400'); // Cache images for 1 day
    headers.set('ETag', `"${decodedFile}"`);

    return new NextResponse(object.body, { headers });
  } catch (error) {
    console.error('[proxy-image] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
