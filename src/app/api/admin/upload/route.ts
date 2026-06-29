import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file' }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ request });
    const ext = file.name.split('.').pop() || 'png';
    const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    if (env.STORAGE) {
      await env.STORAGE.put(key, file.stream(), {
        httpMetadata: { contentType: file.type },
      });
    }

    const imageUrl = `/api/admin/proxy-image?file=${key}`;

    const db = await getDB(request);
    if (db) {
      await db.prepare(
        'INSERT INTO uploaded_images (filename, url, category) VALUES (?, ?, ?)'
      ).bind(file.name, imageUrl, category).run();
    }

    return NextResponse.json({ success: true, image: { filename: file.name, url: imageUrl, category } });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed', details: String(error) }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ images: [] });
    const result = await db.prepare('SELECT * FROM uploaded_images ORDER BY id DESC').all();
    return NextResponse.json({ images: result.results || [] });
  } catch {
    return NextResponse.json({ images: [] });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const db = await getDB(request);
    if (db) {
      const row = await db.prepare('SELECT url FROM uploaded_images WHERE id=?').bind(id).first();
      if (row) {
        const url = row.url as string;
        const fileKey = url.split('file=')[1];
        if (fileKey) {
          try {
            const { env } = await getCloudflareContext({ request });
            if (env.STORAGE) await env.STORAGE.delete(fileKey);
          } catch { /* ignore R2 delete failure */ }
        }
        await db.prepare('DELETE FROM uploaded_images WHERE id=?').bind(id).run();
      }
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
