import { NextRequest, NextResponse } from 'next/server';

const ADMIN_PASSWORD = 'funing2026';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      const token = btoa(`admin:${Date.now()}`);
      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}
