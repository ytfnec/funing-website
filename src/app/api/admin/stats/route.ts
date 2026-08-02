import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { queryFirst } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [products, contacts, views, viewsToday] = await Promise.all([
      queryFirst<{ n: number }>('SELECT COUNT(*) as n FROM products'),
      queryFirst<{ n: number }>('SELECT COUNT(*) as n FROM contact_submissions'),
      queryFirst<{ n: number }>('SELECT COUNT(*) as n FROM page_views'),
      queryFirst<{ n: number }>(
        `SELECT COUNT(*) as n FROM page_views WHERE created_at >= datetime('now', '-1 day')`
      ),
    ]);

    return NextResponse.json({
      stats: {
        products: products?.n ?? 0,
        contacts: contacts?.n ?? 0,
        views: views?.n ?? 0,
        viewsToday: viewsToday?.n ?? 0,
      },
    });
  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
