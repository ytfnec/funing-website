import { NextRequest, NextResponse } from 'next/server';
import { getSession, authenticateAdmin, createToken, setSessionCookie, clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      );
    }
    
    const user = await authenticateAdmin(email, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
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