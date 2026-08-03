import type { MetadataRoute } from 'next';

// Pure static content — let Next build it at build time so it's served from
// the CDN asset cache instead of hitting the Worker on every crawl request.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://fnec.net/sitemap.xml',
  };
}
