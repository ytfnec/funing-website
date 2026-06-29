import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'general';
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const ext = file.name.split('.').pop() || 'png';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    let imageUrl = '';

    // Try R2
    try {
      const { env } = await getCloudflareContext({ request });
      if (env.STORAGE) {
        await env.STORAGE.put(filename, file.stream(), {
          httpMetadata: { contentType: file.type || 'image/png' },
        });
        imageUrl = `/api/admin/proxy-image?file=${filename}`;
      }
    } catch { /* R2 unavailable */ }

    // Fallback: data URL
    if (!imageUrl) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      imageUrl = `data:${file.type || 'image/png'};base64,${base64}`;
    }

    // Save metadata to D1
    try {
      const db = await getDB(request);
      if (db) {
        await db.prepare(
          'INSERT INTO uploaded_images (filename, url, category, created_at) VALUES (?, ?, ?, ?)'
        ).bind(file.name, imageUrl, category, new Date().toISOString()).run();
      }
    } catch { /* ok */ }

    return NextResponse.json({ success: true, image: { filename: file.name, url: imageUrl, category } }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed', details: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ images: [] }, { headers: { 'Cache-Control': 'no-store' } });
    const result = await db.prepare('SELECT * FROM uploaded_images ORDER BY id DESC').all();
    return NextResponse.json({ images: result.results || [] }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ images: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const db = await getDB(request);
    if (db && id) {
      const img = await db.prepare('SELECT * FROM uploaded_images WHERE id = ?').bind(id).first();
      if (img?.url?.includes('/api/admin/proxy-image?file=')) {
        try {
          const { env } = await getCloudflareContext({ request });
          if (env.STORAGE) {
            const fileParam = new URL(img.url, 'http://localhost').searchParams.get('file');
            if (fileParam) await env.STORAGE.delete(fileParam);
          }
        } catch { /* ok */ }
      }
      await db.prepare('DELETE FROM uploaded_images WHERE id = ?').bind(id).run();
    }
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
