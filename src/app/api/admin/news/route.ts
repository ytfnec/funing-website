import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, queryFirst, execute, generateId, nowISO } from '@/lib/db';
import { availableFields, normalizeArticle, NEWS_FIELDS, type NewsField } from '@/lib/news';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_CONTENT_LENGTH = 20000;

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const cols = await availableFields(NEWS_FIELDS);
    const hasPublishedAt = cols.includes('published_at');
    const rows = await query(
      `SELECT ${cols.join(', ')} FROM news_article ORDER BY ${
        hasPublishedAt ? 'published_at' : 'created_at'
      } DESC`
    );

    return NextResponse.json({ articles: rows.map((r) => normalizeArticle(r)) });
  } catch (error) {
    console.error('Admin news list error:', error);
    return NextResponse.json({ error: 'Failed to fetch news articles' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      id,
      slug,
      title,
      excerpt,
      content,
      cover_image,
      author,
      status,
    }: {
      id?: string;
      slug?: string;
      title?: string;
      excerpt?: string;
      content?: string;
      cover_image?: string;
      author?: string;
      status?: string;
    } = body;

    if (!slug || typeof slug !== 'string' || !SLUG_RE.test(slug)) {
      return NextResponse.json(
        { error: 'Slug must be lowercase kebab-case, e.g. `new-product-2026`' },
        { status: 400 }
      );
    }
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (typeof content === 'string' && content.length > MAX_CONTENT_LENGTH) {
      return NextResponse.json(
        { error: `Content must be under ${MAX_CONTENT_LENGTH} chars` },
        { status: 400 }
      );
    }

    const fields = new Set(await availableFields(NEWS_FIELDS));
    const cleanStatus = status === 'published' ? 'published' : 'draft';

    // Slug collision check (excluding self on update).
    const existing = await queryFirst<{ id: string }>(
      'SELECT id FROM news_article WHERE slug = ?',
      [slug]
    );
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    // Update path.
    if (id) {
      const existingById = await queryFirst<{ id: string }>(
        'SELECT id FROM news_article WHERE id = ?',
        [id]
      );
      if (!existingById) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }

      const sets: string[] = [];
      const params: any[] = [];
      // Only touch columns explicitly present in the request body, so a
      // partial update (e.g. publish toggle) can't wipe the other fields.
      const assign = (col: NewsField, value: unknown) => {
        if (value === undefined) return;
        if (!fields.has(col)) return;
        sets.push(`${col} = ?`);
        params.push(value);
      };
      assign('slug', slug);
      assign('title', title.trim());
      assign('excerpt', excerpt ?? null);
      assign('content', content ?? null);
      assign('cover_image', cover_image ?? null);
      assign('author', author ?? null);
      // Pass the raw `status` so an omitted status is skipped entirely.
      assign('status', status === undefined ? undefined : cleanStatus);
      assign('updated_at', nowISO());
      // Stamp published_at on first publish so the article surfaces at the top.
      if (fields.has('published_at') && cleanStatus === 'published') {
        const cur = await queryFirst<{ published_at: string | null }>(
          'SELECT published_at FROM news_article WHERE id = ?',
          [id]
        );
        if (!cur?.published_at) {
          sets.push('published_at = ?');
          params.push(nowISO());
        }
      }
      if (sets.length === 0) {
        return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
      }
      params.push(id);
      await execute(`UPDATE news_article SET ${sets.join(', ')} WHERE id = ?`, params);
      return NextResponse.json({ success: true, id, created: false });
    }

    // Create path.
    const newId = generateId('news');
    const cols: string[] = [];
    const vals: (string | number | null)[] = [];
    const placeholders: string[] = [];
    const push = (col: NewsField, value: string | number | null) => {
      if (!fields.has(col)) return;
      cols.push(col);
      vals.push(value);
      placeholders.push('?');
    };
    push('id', newId);
    push('slug', slug);
    push('title', title.trim());
    push('excerpt', excerpt ?? null);
    push('content', content ?? null);
    push('cover_image', cover_image ?? null);
    push('author', author ?? null);
    push('status', cleanStatus);
    push('published_at', cleanStatus === 'published' ? nowISO() : null);
    push('created_at', nowISO());
    push('updated_at', nowISO());

    await execute(
      `INSERT INTO news_article (${cols.join(', ')}) VALUES (${placeholders.join(', ')})`,
      vals
    );
    return NextResponse.json({ success: true, id: newId, created: true });
  } catch (error) {
    console.error('Admin news save error:', error);
    return NextResponse.json({ error: 'Failed to save news article' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await execute('DELETE FROM news_article WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin news delete error:', error);
    return NextResponse.json({ error: 'Failed to delete news article' }, { status: 500 });
  }
}
