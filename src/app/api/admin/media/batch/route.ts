import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, execute, getR2 } from '@/lib/db';

const MAX_BATCH = 100;
const MAX_ID_LENGTH = 200;

const VALID_ACTIONS = ['delete'] as const;

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { action, ids } = body;

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: `Action must be one of: ${VALID_ACTIONS.join(', ')}` },
        { status: 400 }
      );
    }
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > MAX_BATCH) {
      return NextResponse.json(
        { error: `ids must be an array of 1-${MAX_BATCH} items` },
        { status: 400 }
      );
    }
    for (const id of ids) {
      if (typeof id !== 'string' || id.length === 0 || id.length > MAX_ID_LENGTH) {
        return NextResponse.json({ error: 'ids must contain only non-empty strings' }, { status: 400 });
      }
    }

    // Resolve R2 keys before deleting so we can clean up storage objects too.
    const placeholders = ids.map(() => '?').join(', ');
    const items = await query<{ id: string; r2_key: string }>(
      `SELECT id, r2_key FROM media_library WHERE id IN (${placeholders})`,
      ids
    );

    // Delete objects from R2 (best-effort — a missing/stale object shouldn't
    // block removing the D1 record, and storage may lag DB state).
    try {
      const r2 = getR2();
      const keys = items.map((i) => i.r2_key).filter(Boolean);
      if (keys.length > 0) {
        await Promise.all(keys.map((key) => r2.delete(key)));
      }
    } catch (e) {
      console.error('R2 bulk delete error:', e);
    }

    await execute(`DELETE FROM media_library WHERE id IN (${placeholders})`, ids);

    return NextResponse.json({ success: true, count: items.length, action });
  } catch (error) {
    console.error('Media bulk action error:', error);
    return NextResponse.json({ error: 'Failed to run bulk action' }, { status: 500 });
  }
}
