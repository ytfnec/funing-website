import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, nowISO, queryFirst } from '@/lib/db';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const { email } = validation.data;
    const normalized = email.trim().toLowerCase();

    const existing = await queryFirst<{ id: string; status: string }>(
      'SELECT id, status FROM newsletter_subscriptions WHERE email = ?',
      [normalized]
    );

    if (existing) {
      if (existing.status !== 'active') {
        // Re-activate a previously unsubscribed address.
        await execute(
          `UPDATE newsletter_subscriptions
           SET status = 'active', unsubscribed_at = NULL, subscribed_at = ?
           WHERE id = ?`,
          [nowISO(), existing.id]
        );
      }
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    const id = generateId('nl');
    await execute(
      `INSERT INTO newsletter_subscriptions (id, email, source, status, subscribed_at)
       VALUES (?, ?, 'footer', 'active', ?)`,
      [id, normalized, nowISO()]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
  }
}
