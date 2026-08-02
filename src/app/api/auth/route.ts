import { NextRequest, NextResponse } from 'next/server';
import { getSession, authenticateAdmin, createToken, setSessionCookie, clearSessionCookie } from '@/lib/auth';

// Brute-force protection: track failed attempts per IP, lock out for 15 min
// after 5 failures. In-memory map (fine for a single Worker instance).
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; lockedUntil: number }>();

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

function isLockedOut(ip: string): boolean {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (Date.now() > entry.lockedUntil) {
    attempts.delete(ip);
    return false;
  }
  return true;
}

function recordFailure(ip: string): void {
  const entry = attempts.get(ip);
  if (!entry) {
    attempts.set(ip, { count: 1, lockedUntil: 0 });
    return;
  }
  const count = entry.count + 1;
  if (count >= MAX_ATTEMPTS) {
    attempts.set(ip, { count, lockedUntil: Date.now() + LOCK_MS });
  } else {
    attempts.set(ip, { count, lockedUntil: 0 });
  }
}

function clearAttempts(ip: string): void {
  attempts.delete(ip);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (isLockedOut(ip)) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }

    const user = await authenticateAdmin(email, password);

    if (!user) {
      recordFailure(ip);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    clearAttempts(ip);
    const token = await createToken(user);
    await setSessionCookie(token);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { error: 'Session check failed' },
      { status: 500 }
    );
  }
}