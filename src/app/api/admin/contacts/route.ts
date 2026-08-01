import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const contacts = await query(`
      SELECT * FROM contact_submissions ORDER BY submitted_at DESC LIMIT ?
    `, [limit]);

    return NextResponse.json({ contacts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const { status, notes } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const sets: string[] = [];
    const params: any[] = [];
    if (status) { sets.push('status = ?'); params.push(status); }
    if (notes !== undefined) { sets.push('notes = ?'); params.push(notes); }
    if (sets.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

    params.push(id);
    await execute(`UPDATE contact_submissions SET ${sets.join(', ')} WHERE id = ?`, params);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}