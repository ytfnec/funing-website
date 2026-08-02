import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { execute } from '@/lib/db';

const MAX_BATCH = 100;
const MAX_ID_LENGTH = 200;

type BatchAction = 'delete' | 'activate' | 'deactivate';

const VALID_ACTIONS: BatchAction[] = ['delete', 'activate', 'deactivate'];

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { action, ids } = body;

    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json(
        { error: 'Action must be one of: delete, activate, deactivate' },
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

    const placeholders = ids.map(() => '?').join(', ');

    if (action === 'delete') {
      await execute(`DELETE FROM content_blocks WHERE id IN (${placeholders})`, ids);
    } else {
      const isActive = action === 'activate' ? 1 : 0;
      await execute(
        `UPDATE content_blocks SET is_active = ? WHERE id IN (${placeholders})`,
        [isActive, ...ids]
      );
    }

    return NextResponse.json({ success: true, count: ids.length, action });
  } catch (error) {
    console.error('Content bulk action error:', error);
    return NextResponse.json({ error: 'Failed to run bulk action' }, { status: 500 });
  }
}
