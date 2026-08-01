import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, execute, queryFirst } from '@/lib/db';

const ALLOWED_KEYS = [
  'site_name',
  'site_tagline',
  'contact_email',
  'contact_phone',
  'ga_measurement_id',
  'gtm_id',
];

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const rows = await query<{ key: string; value: string }>(
      'SELECT key, value FROM site_settings'
    );

    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(body)) {
      if (!ALLOWED_KEYS.includes(key)) continue;
      if (typeof value !== 'string') continue;

      const existing = await queryFirst(
        'SELECT key FROM site_settings WHERE key = ?',
        [key]
      );

      if (existing) {
        await execute('UPDATE site_settings SET value = ? WHERE key = ?', [value, key]);
      } else {
        await execute(
          'INSERT INTO site_settings (key, value, description) VALUES (?, ?, ?)',
          [key, value, key]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings save error:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
