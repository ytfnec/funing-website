import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// Public endpoint: returns active content blocks as a map of
// `slug` -> `content`, used by the i18n layer to override defaults.
// Slug format: `<lang>__<i18n-key>` (e.g. `en__home.hero.title1`).
export async function GET() {
  try {
    const blocks = await query<{ slug: string; content: string }>(
      `SELECT slug, content FROM content_blocks
       WHERE is_active = 1 AND content IS NOT NULL AND content != ''
       ORDER BY page ASC, sort_order ASC`
    );

    const overrides: Record<string, string> = {};
    for (const block of blocks) {
      overrides[block.slug] = block.content;
    }

    // Cache for 60s on the edge so the page isn't hammering D1 every request.
    return NextResponse.json({ overrides }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Content blocks fetch error:', error);
    // Fail soft: return empty overrides so the site still renders defaults.
    return NextResponse.json({ overrides: {} });
  }
}
