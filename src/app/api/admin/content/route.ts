import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/cloudflare';

// GET all content
export async function GET(request: NextRequest) {
  try {
    const db = getDB(request);
    const results = await db.prepare('SELECT * FROM SiteContent').all();
    return NextResponse.json({ contents: results.results });
  } catch (error) {
    // Fallback to Prisma for local dev
    try {
      const { db: prisma } = await import('@/lib/db');
      const contents = await prisma.siteContent.findMany();
      return NextResponse.json({ contents });
    } catch {
      return NextResponse.json({ error: 'Failed to fetch content', details: String(error) }, { status: 500 });
    }
  }
}

// PUT - update single content item
export async function PUT(request: NextRequest) {
  try {
    const { key, zh, en } = await request.json();

    // Try D1 first
    try {
      const db = getDB(request);
      await db.prepare('INSERT OR REPLACE INTO SiteContent (key, zh, en) VALUES (?, ?, ?)').bind(key, zh, en).run();
    } catch {
      // Fallback to Prisma for local dev
      const { db: prisma } = await import('@/lib/db');
      await prisma.siteContent.upsert({
        where: { key },
        update: { zh, en },
        create: { key, zh, en },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content', details: String(error) }, { status: 500 });
  }
}

// PATCH - batch update
export async function PATCH(request: NextRequest) {
  try {
    const { items } = await request.json();

    // Try D1 first
    try {
      const db = getDB(request);
      for (const item of items) {
        await db.prepare('INSERT OR REPLACE INTO SiteContent (key, zh, en) VALUES (?, ?, ?)').bind(item.key, item.zh, item.en).run();
      }
    } catch {
      // Fallback to Prisma for local dev
      const { db: prisma } = await import('@/lib/db');
      for (const item of items) {
        await prisma.siteContent.upsert({
          where: { key: item.key },
          update: { zh: item.zh, en: item.en },
          create: { key: item.key, zh: item.zh, en: item.en },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to batch update', details: String(error) }, { status: 500 });
  }
}
