import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ error: 'No database' }, { status: 500 });
    const result = await db.prepare('SELECT * FROM news_article ORDER BY "order" ASC').all();
    return NextResponse.json({ news: result.results || [] });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ error: 'No database' }, { status: 500 });
    const { date, titleZh, titleEn, summaryZh, summaryEn, imageUrl, order } = await request.json();
    const result = await db.prepare(
      'INSERT INTO news_article (date, title_zh, title_en, summary_zh, summary_en, image_url, "order") VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(date, titleZh, titleEn, summaryZh, summaryEn, imageUrl || null, order || 0).run();
    return NextResponse.json({ success: true, id: result.meta.last_row_id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ error: 'No database' }, { status: 500 });
    const { id, date, titleZh, titleEn, summaryZh, summaryEn, imageUrl, order } = await request.json();
    await db.prepare(
      'UPDATE news_article SET date=?, title_zh=?, title_en=?, summary_zh=?, summary_en=?, image_url=?, "order"=? WHERE id=?'
    ).bind(date, titleZh, titleEn, summaryZh, summaryEn, imageUrl || null, order || 0, id).run();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ error: 'No database' }, { status: 500 });
    const { id } = await request.json();
    await db.prepare('DELETE FROM news_article WHERE id=?').bind(id).run();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
