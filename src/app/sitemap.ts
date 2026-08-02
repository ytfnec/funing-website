import type { MetadataRoute } from 'next';
import { query } from '@/lib/db';

const BASE_URL = 'https://fnec.net';

// Static public routes (exclude admin + api + thank-you).
const STATIC_ROUTES = [
  '',
  '/about',
  '/accessories',
  '/contact',
  '/cookies',
  '/elevate',
  '/oem',
  '/privacy',
  '/products',
  '/quote',
  '/resources',
  '/terms',
] as const;

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/products' ? 0.9 : 0.7,
  }));

  // Product detail pages — read live slugs from D1, fall back to the
  // four known product lines if the DB isn't reachable (e.g. build time).
  let slugs: string[] = [];
  try {
    const rows = await query<{ slug: string }>(
      'SELECT slug FROM products WHERE in_stock = 1 ORDER BY sort_order ASC'
    );
    slugs = rows.map((r) => r.slug);
  } catch {
    slugs = ['sauna-controllers', 'jacquard-drivers', 'branded-units', 'accessories'];
  }

  const productEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
