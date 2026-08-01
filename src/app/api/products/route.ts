import { NextRequest, NextResponse } from 'next/server';
import { query, queryFirst, execute } from '@/lib/db';

export async function GET() {
  try {
    const products = await query(`
      SELECT id, slug, name, sub_title, price_range, category, short_description,
             hero_image, gallery_images, specifications, features, warranty_info,
             installation_info, electrical_requirements, lead_time, in_stock, sort_order
      FROM products
      WHERE in_stock = 1
      ORDER BY sort_order ASC
    `);
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}