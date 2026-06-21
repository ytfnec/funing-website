import { NextRequest, NextResponse } from 'next/server';
import { getDB, getEnv } from '@/lib/cloudflare';

export async function GET(request: NextRequest) {
  try {
    try {
      const db = getDB(request);
      const results = await db.prepare('SELECT * FROM NewsArticle ORDER BY "order" ASC').all();
      return NextResponse.json({ news: results.results });
    } catch {
      const { db: prisma } = await import('@/lib/db');
      const news = await prisma.newsArticle.findMany({ orderBy: { order: 'asc' } });
      return NextResponse.json({ news });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    try {
      const db = getDB(request);
      await db.prepare('INSERT INTO NewsArticle (date, titleZh, titleEn, summaryZh, summaryEn, imageUrl, "order") VALUES (?, ?, ?, ?, ?, ?, ?)').bind(
        data.date, data.titleZh, data.titleEn, data.summaryZh, data.summaryEn, data.imageUrl || null, data.order || 0
      ).run();
    } catch {
      const { db: prisma } = await import('@/lib/db');
      await prisma.newsArticle.create({ data });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    try {
      const db = getDB(request);
      const sets: string[] = [];
      const vals: unknown[] = [];
      for (const [k, v] of Object.entries(data)) {
        sets.push(`"${k}" = ?`);
        vals.push(v);
      }
      vals.push(id);
      await db.prepare(`UPDATE NewsArticle SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
    } catch {
      const { db: prisma } = await import('@/lib/db');
      await prisma.newsArticle.update({ where: { id: Number(id) }, data });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    try {
      const db = getDB(request);
      await db.prepare('DELETE FROM NewsArticle WHERE id = ?').bind(Number(id)).run();
    } catch {
      const { db: prisma } = await import('@/lib/db');
      await prisma.newsArticle.delete({ where: { id: Number(id) } });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
