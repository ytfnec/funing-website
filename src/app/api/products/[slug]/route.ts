import { NextRequest, NextResponse } from 'next/server';
import { query, queryFirst, execute } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const product = await queryFirst(`
      SELECT id, slug, name, sub_title, price_range, category, short_description,
             long_description, hero_image, gallery_images, specifications, features,
             warranty_info, installation_info, electrical_requirements, lead_time,
             in_stock, sort_order
      FROM products
      WHERE slug = ? AND in_stock = 1
    `, [slug]);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Also fetch variants
    const variants = await query(`
      SELECT id, name, sku, price_adjustment, attributes, in_stock, sort_order
      FROM product_variants
      WHERE product_id = ? AND in_stock = 1
      ORDER BY sort_order ASC
    `, [product.id]);
    
    return NextResponse.json({ product, variants }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}