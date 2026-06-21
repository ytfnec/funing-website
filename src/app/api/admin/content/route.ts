import { NextRequest, NextResponse } from 'next/server';

// GET all content
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env?.DB) {
      const results = await env.DB.prepare('SELECT * FROM SiteContent').all();
      return NextResponse.json({ contents: results.results });
    }
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content', details: String(error) }, { status: 500 });
  }
}

// PUT - update single content item
export async function PUT(request: NextRequest) {
  try {
    const { key, zh, en } = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env?.DB) {
      await env.DB.prepare('INSERT OR REPLACE INTO SiteContent (key, zh, en) VALUES (?, ?, ?)').bind(key, zh, en).run();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content', details: String(error) }, { status: 500 });
  }
}

// PATCH - batch update
export async function PATCH(request: NextRequest) {
  try {
    const { items } = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env?.DB) {
      for (const item of items) {
        await env.DB.prepare('INSERT OR REPLACE INTO SiteContent (key, zh, en) VALUES (?, ?, ?)').bind(item.key, item.zh, item.en).run();
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to batch update', details: String(error) }, { status: 500 });
  }
}
