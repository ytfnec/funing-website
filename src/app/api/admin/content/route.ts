import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryFirst, execute, generateId, nowISO } from '@/lib/db';

// Slug format: `<lang>__<i18n-key>` (e.g. `en__home.hero.title1`).
// Validation: exactly two underscores separate lang from key; the key part
// allows letters, digits, dots, hyphens, spaces (but no underscores, so the
// separator stays unambiguous).
const SLUG_RE = /^[a-z]{2}__[a-zA-Z0-9.\-\s]+$/;
const MAX_CONTENT_LENGTH = 5000;

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const blocks = await query(`
      SELECT id, slug, page, section, type, title, content, is_active, sort_order, updated_at
      FROM content_blocks
      ORDER BY page ASC, sort_order ASC, slug ASC
    `);

    return NextResponse.json({ blocks });
  } catch (error) {
    console.error('Content blocks fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch content blocks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { slug, content, page = '', section = '', title = '', type = 'text', is_active = 1 } = body;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }
    if (!SLUG_RE.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must be `<lang>__<key>`, e.g. `en__home.hero.title1`' },
        { status: 400 }
      );
    }
    if (typeof content !== 'string' || content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content must be a string under ${MAX_CONTENT_LENGTH} chars` },
        { status: 400 }
      );
    }

    const existing = await queryFirst<{ id: string }>(
      'SELECT id FROM content_blocks WHERE slug = ?',
      [slug]
    );

    if (existing) {
      await execute(
        `UPDATE content_blocks
         SET content = ?, page = ?, section = ?, title = ?, type = ?, is_active = ?, sort_order = ?, updated_at = ?
         WHERE slug = ?`,
        [content, page || null, section || null, title || null, type || 'text', is_active ? 1 : 0, 0, nowISO(), slug]
      );
      return NextResponse.json({ success: true, id: existing.id, created: false });
    }

    const id = generateId('block');
    await execute(
      `INSERT INTO content_blocks (id, slug, page, section, type, title, content, is_active, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [id, slug, page || null, section || null, type || 'text', title || null, content, is_active ? 1 : 0, nowISO(), nowISO()]
    );

    return NextResponse.json({ success: true, id, created: true });
  } catch (error) {
    console.error('Content block save error:', error);
    return NextResponse.json({ error: 'Failed to save content block' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await execute('DELETE FROM content_blocks WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content block delete error:', error);
    return NextResponse.json({ error: 'Failed to delete content block' }, { status: 500 });
  }
}
