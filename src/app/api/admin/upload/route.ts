import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    let imageUrl = '';
    const ext = file.name.split('.').pop() || 'png';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    // Try R2 storage
    try {
      const { env } = await getCloudflareContext({ request });
      if (env.STORAGE) {
        await env.STORAGE.put(filename, file.stream(), {
          httpMetadata: { contentType: file.type || 'image/png' },
        });
        imageUrl = `/api/admin/proxy-image?file=${filename}`;
      }
    } catch {
      // R2 not available, use fallback below
    }

    // Fallback: data URL (only if R2 failed)
    if (!imageUrl) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString('base64');
      const mimeType = file.type || 'image/png';
      imageUrl = `data:${mimeType};base64,${base64}`;
    }

    // Save metadata to D1
    try {
      const db = await getDB(request);
      if (db) {
        await db.prepare(
          'INSERT INTO uploaded_images (filename, url, category, created_at) VALUES (?, ?, ?, ?)'
        ).bind(file.name, imageUrl, category, new Date().toISOString()).run();
      }
    } catch {
      // D1 save failed, image still accessible via URL
    }

    return NextResponse.json({
      success: true,
      image: { filename: file.name, url: imageUrl, category },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed', details: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) {
      return NextResponse.json({ images: [] }, { headers: { 'Cache-Control': 'no-store' } });
    }
    const result = await db.prepare('SELECT * FROM uploaded_images ORDER BY id DESC').all();
    return NextResponse.json(
      { images: result.results || [] },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return NextResponse.json({ images: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    // Get image info from D1 first
    const db = await getDB(request);
    if (db && id) {
      const img = await db.prepare('SELECT * FROM uploaded_images WHERE id = ?').bind(id).first();

      // Delete from R2 if it's an R2 URL
      if (img && img.url && img.url.includes('/api/admin/proxy-image?file=')) {
        try {
          const { env } = await getCloudflareContext({ request });
          if (env.STORAGE) {
            const fileParam = new URL(img.url, 'http://localhost').searchParams.get('file');
            if (fileParam) await env.STORAGE.delete(fileParam);
          }
        } catch {
          // R2 delete failed, continue with D1 delete
        }
      }

      await db.prepare('DELETE FROM uploaded_images WHERE id = ?').bind(id).run();
    }

    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 });
  }
}
