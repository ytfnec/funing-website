import { NextRequest, NextResponse } from 'next/server';
import { getEnv } from '@/lib/cloudflare';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const env = getEnv(request);

    // Try R2 storage
    if (env.STORAGE) {
      const ext = file.name.split('.').pop() || 'png';
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      await env.STORAGE.put(filename, file.stream());
      const imageUrl = `/api/admin/proxy-image?file=${filename}`;
      return NextResponse.json({ success: true, image: { filename: file.name, url: imageUrl, category } });
    }

    // Fallback: store as data URL in D1
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = file.type || 'image/png';
    const imageUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({ success: true, image: { filename: file.name, url: imageUrl, category } });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed', details: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ images: [] });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ success: true });
}
