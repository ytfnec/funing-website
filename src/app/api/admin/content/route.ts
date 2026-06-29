import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

const NO_CACHE = { 'Cache-Control': 'no-store' };

export async function GET(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ error: 'No database' }, { status: 500, headers: NO_CACHE });
    const result = await db.prepare('SELECT * FROM site_content').all();
    return NextResponse.json({ contents: result.results || [] }, { headers: NO_CACHE });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500, headers: NO_CACHE });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ error: 'No database' }, { status: 500, headers: NO_CACHE });
    const { key, zh, en } = await request.json();
    await db.prepare(
      'INSERT INTO site_content (key, zh, en) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET zh=excluded.zh, en=excluded.en'
    ).bind(key, zh, en).run();
    return NextResponse.json({ success: true }, { headers: NO_CACHE });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update', details: String(error) }, { status: 500, headers: NO_CACHE });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const db = await getDB(request);
    if (!db) return NextResponse.json({ error: 'No database' }, { status: 500, headers: NO_CACHE });
    const { items } = await request.json();
    for (const item of items) {
      await db.prepare(
        'INSERT INTO site_content (key, zh, en) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET zh=excluded.zh, en=excluded.en'
      ).bind(item.key, item.zh, item.en).run();
    }
    return NextResponse.json({ success: true }, { headers: NO_CACHE });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to batch update', details: String(error) }, { status: 500, headers: NO_CACHE });
  }
}
