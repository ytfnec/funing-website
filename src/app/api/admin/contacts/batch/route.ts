import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { execute } from '@/lib/db';

const MAX_BATCH = 100;
const MAX_ID_LENGTH = 200;

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { ids } = body;

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
    const result = await execute(
      `DELETE FROM contact_submissions WHERE id IN (${placeholders})`,
      ids
    );

    return NextResponse.json({ success: true, count: ids.length });
  } catch (error) {
    console.error('Contacts bulk delete error:', error);
    return NextResponse.json({ error: 'Failed to run bulk action' }, { status: 500 });
  }
}
