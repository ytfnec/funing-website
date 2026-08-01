import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryFirst, execute, getR2, generateId, nowISO } from '@/lib/db';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

// Lightweight magic-byte sniffing for the allowed image types.
// Guards against files whose declared type doesn't match their content.
function sniffImageType(bytes: Uint8Array): string | null {
  // JPEG: FF D8 FF
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'image/jpeg';
  }
  // PNG: 89 50 4E 47
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return 'image/png';
  }
  // GIF: "GIF8"
  if (bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return 'image/gif';
  }
  // WEBP: "RIFF" .... "WEBP"
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  // AVIF: starts with ISO BMFF ("ftyp") — box size + "ftyp" + brand
  if (
    bytes.length >= 12 &&
    bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70
  ) {
    return 'image/avif';
  }
  return null;
}

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
        { error: `Unsupported file type: ${file.type}. Allowed: jpeg, png, webp, gif, avif` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const sniffed = sniffImageType(bytes);
    if (!sniffed) {
      return NextResponse.json(
        { error: 'File content does not match a supported image format.' },
        { status: 400 }
      );
    }

    // Use the sniffed type (more trustworthy than the client-declared one)
    const mimeType = sniffed;
    const ext = (mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1]);
    const id = generateId('media');
    const r2Key = `media/${id}.${ext}`;

    // Upload to R2
    const r2 = getR2();
    await r2.put(r2Key, arrayBuffer, {
      httpMetadata: { contentType: mimeType },
    });

    const createdAt = nowISO();

    // Record metadata in D1; if this fails, roll back the R2 object
    try {
      await execute(
        `INSERT INTO media_library (id, filename, original_name, mime_type, size, r2_key, alt_text, uploaded_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, r2Key, file.name, mimeType, file.size, r2Key, altText, user.id, createdAt]
      );
    } catch (dbError) {
      // Roll back the orphaned R2 object so we don't leak storage.
      try {
        await r2.delete(r2Key);
      } catch {
        // best-effort cleanup
      }
      throw dbError;
    }

    return NextResponse.json({
      success: true,
      media: {
        id,
        filename: r2Key,
        original_name: file.name,
        mime_type: mimeType,
        size: file.size,
        r2_key: r2Key,
        alt_text: altText,
        created_at: createdAt,
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
