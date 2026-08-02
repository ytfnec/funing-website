import { NextRequest, NextResponse } from 'next/server';
import { queryFirst } from '@/lib/db';
import { availableFields, normalizeArticle } from '@/lib/news';

// Public single published article by slug.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const fields = await availableFields([
      'id',
      'slug',
      'title',
      'excerpt',
      'content',
      'cover_image',
      'author',
      'status',
      'published_at',
      'created_at',
      'updated_at',
    ]);
    const cols = fields.join(', ');
    const hasStatus = fields.includes('status');

    const row = hasStatus
      ? await queryFirst<Record<string, unknown>>(
          `SELECT ${cols} FROM news_article WHERE slug = ? AND status = 'published'`,
          [slug]
        )
      : await queryFirst<Record<string, unknown>>(
          `SELECT ${cols} FROM news_article WHERE slug = ?`,
          [slug]
        );

    const article = normalizeArticle(row);
    if (!article) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ article });
  } catch (error) {
    console.error('News article fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}
