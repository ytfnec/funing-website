import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { availableFields, normalizeArticle } from '@/lib/news';

// Public list of published news articles.
export async function GET() {
  try {
    const fields = await availableFields([
      'id',
      'slug',
      'title',
      'excerpt',
      'cover_image',
      'status',
      'published_at',
      'created_at',
    ]);
    const cols = fields.join(', ');
    const hasStatus = fields.includes('status');
    const hasPublishedAt = fields.includes('published_at');

    // If the live table predates the `status` column, surface everything.
    const where = hasStatus ? "WHERE status = 'published'" : '';
    const orderBy = hasPublishedAt ? 'published_at DESC' : 'created_at DESC';

    const rows = await query(
      `SELECT ${cols} FROM news_article ${where} ORDER BY ${orderBy}`
    );

    return NextResponse.json({
      articles: rows.map((r) => normalizeArticle(r)),
    });
  } catch (error) {
    console.error('News list fetch error:', error);
    return NextResponse.json({ articles: [] }, { status: 200 });
  }
}
