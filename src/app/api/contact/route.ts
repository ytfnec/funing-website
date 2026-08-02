import { NextRequest, NextResponse } from 'next/server';
import { execute, generateId, nowISO } from '@/lib/db';
import { sendContactNotification } from '@/lib/mailer';
import { z } from 'zod';

const contactSchema = z.object({
  type: z.enum(['quote', 'oem', 'product', 'general', 'call', 'custom']),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  message: z.string().optional(),
  productInterest: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'either']).optional(),
  bestTime: z.string().optional(),
  // Honeypot field — hidden from real users, spam bots fill it in.
  website: z.string().optional(),
});

// Simple in-memory rate limiter: max 5 submissions per IP per 10 minutes.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const submissions = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (submissions.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (times.length >= RATE_MAX) {
    submissions.set(ip, times);
    return true;
  }
  times.push(now);
  submissions.set(ip, times);
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot: if the hidden field is filled, it's a bot — respond success
    // without saving, so bots think they got through.
    if (body?.website && typeof body.website === 'string' && body.website.length > 0) {
      return NextResponse.json({ success: true, id: 'spam-filtered' });
    }

    // Basic rate limiting per IP (from CF-Connecting-IP header).
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const data = validation.data;
    const id = generateId();
    
    await execute(`
      INSERT INTO contact_submissions (
        id, type, name, email, phone, company, location, message,
        product_interest, preferred_contact, best_time, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
    `, [
      id,
      data.type,
      data.name,
      data.email,
      data.phone || null,
      data.company || null,
      data.location || null,
      data.message || null,
      data.productInterest || null,
      data.preferredContact || null,
      data.bestTime || null,
      nowISO(),
    ]);
    
    // Send email notification to admin (fire-and-forget, never blocks the response)
    await sendContactNotification({
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      location: data.location,
      productInterest: data.productInterest,
      preferredContact: data.preferredContact,
      bestTime: data.bestTime,
      message: data.message,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to submit form. Please try again.' },
      { status: 500 }
    );
  }
}