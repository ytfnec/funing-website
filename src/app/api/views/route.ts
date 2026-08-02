import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, nowISO } from '@/lib/db';

// Lightweight page-view beacon. Called fire-and-forget from the client
// (sendBeacon), so failures here must never affect the page.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const path = typeof body.path === 'string' && body.path.length <= 500
      ? body.path
      : request.nextUrl.pathname || '/';

    const referrer = request.headers.get('referer');
    const userAgent = request.headers.get('user-agent');
    // cf-ipcountry is set by Cloudflare for proxied traffic.
    const country = request.headers.get('cf-ipcountry') || '';

    await execute(
      `INSERT INTO page_views (id, path, referrer, user_agent, country, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        generateId('pv'),
        path,
        referrer ? referrer.slice(0, 500) : null,
        userAgent ? userAgent.slice(0, 500) : null,
        country || null,
        nowISO(),
      ]
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Never throw — analytics must not break the page.
    console.error('View tracking error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
