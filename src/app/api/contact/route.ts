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
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
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