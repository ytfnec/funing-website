import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env?.DB) {
      const results = await env.DB.prepare('SELECT * FROM NewsArticle ORDER BY "order" ASC').all();
      return NextResponse.json({ news: results.results });
    }
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env?.DB) {
      await env.DB.prepare('INSERT INTO NewsArticle (date, titleZh, titleEn, summaryZh, summaryEn, imageUrl, "order") VALUES (?, ?, ?, ?, ?, ?, ?)').bind(
        data.date, data.titleZh, data.titleEn, data.summaryZh, data.summaryEn, data.imageUrl || null, data.order || 0
      ).run();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create news', details: String(error) }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env?.DB) {
      const sets: string[] = [];
      const vals: unknown[] = [];
      for (const [k, v] of Object.entries(data)) {
        sets.push(`"${k}" = ?`);
        vals.push(v);
      }
      vals.push(id);
      await env.DB.prepare(`UPDATE NewsArticle SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update news', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env?.DB) {
      await env.DB.prepare('DELETE FROM NewsArticle WHERE id = ?').bind(Number(id)).run();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Database not available' }, { status: 503 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
  }
}
