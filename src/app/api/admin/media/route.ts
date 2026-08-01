import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryFirst, execute, getR2, generateId, nowISO } from '@/lib/db';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const media = await query(`
      SELECT id, filename, original_name, mime_type, size, r2_key, alt_text, created_at
      FROM media_library
      ORDER BY created_at DESC
    `);

    return NextResponse.json({ media });
  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('alt') as string | null) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Allowed: jpeg, png, webp, gif, svg, avif` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
    const id = generateId('media');
    const r2Key = `media/${id}.${ext}`;

    // Upload to R2
    const r2 = getR2();
    const arrayBuffer = await file.arrayBuffer();
    await r2.put(r2Key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
    });

    // Record metadata in D1
    await execute(
      `INSERT INTO media_library (id, filename, original_name, mime_type, size, r2_key, alt_text, uploaded_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, r2Key, file.name, file.type, file.size, r2Key, altText, user.id, nowISO()]
    );

    return NextResponse.json({
      success: true,
      media: {
        id,
        filename: r2Key,
        original_name: file.name,
        mime_type: file.type,
        size: file.size,
        r2_key: r2Key,
        alt_text: altText,
      },
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const item = await queryFirst<{ r2_key: string }>(
      'SELECT r2_key FROM media_library WHERE id = ?',
      [id]
    );

    if (!item) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    // Delete from R2 (best-effort)
    try {
      const r2 = getR2();
      await r2.delete(item.r2_key);
    } catch (e) {
      console.error('R2 delete error:', e);
      // Continue — the D1 record should still be removed
    }

    await execute('DELETE FROM media_library WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
