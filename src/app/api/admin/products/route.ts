import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query, execute } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const products = await query(`
      SELECT * FROM products ORDER BY sort_order ASC
    `);

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { slug, name, sub_title, price_range, category } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: 'Slug and name required' }, { status: 400 });
    }

    const id = `prod-${slug}`;
    await execute(`
      INSERT INTO products (id, slug, name, sub_title, price_range, category, in_stock, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, 1, 99)
    `, [id, slug, name, sub_title || null, price_range || null, category || 'indoor-infrared']);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const sets: string[] = [];
    const params: any[] = [];
    for (const [key, value] of Object.entries(updates) as [string, any][]) {
      if (['name', 'slug', 'sub_title', 'price_range', 'category', 'short_description', 'long_description', 'hero_image', 'gallery_images', 'specifications', 'features', 'warranty_info', 'installation_info', 'electrical_requirements', 'lead_time', 'in_stock', 'sort_order'].includes(key)) {
        sets.push(`${key} = ?`);
        params.push(value);
      }
    }

    if (sets.length === 0) return NextResponse.json({ error: 'No valid fields' }, { status: 400 });

    params.push(id);
    await execute(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`, params);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await execute('DELETE FROM product_variants WHERE product_id = ?', [id]);
    await execute('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}