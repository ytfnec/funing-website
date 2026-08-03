/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'pub-*.r2.dev' },
    ],
  },
  async headers() {
    return [
      // Public pages: let Cloudflare CDN cache the pre-rendered HTML at the
      // edge. These pages are 'use client' shells — the HTML is a fixed frame
      // and all content is rendered client-side from the cached APIs — so
      // caching the shell 300s (with 1h stale-while-revalidate) is invisible
      // to users while cutting Worker SSR traffic ~5x. Long SWR means that if
      // the Worker enters an 1102 timeout window, the CDN keeps serving the
      // cached shell for up to an hour instead of erroring — the key free-tier
      // mitigation for recurring SSR timeouts.
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=3600' },
        ],
      },
      // Admin pages: never edge-cache (session cookies, live data). MUST be
      // listed AFTER the catch-all above: Next.js applies the LAST matching
      // header rule (verified on 2026-08-03 — rules listed first were
      // silently overridden by the catch-all).
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      },
      // Admin API: never edge-cache (auth + mutations). Public read APIs
      // (/api/products, /api/news) set their own Cache-Control in their route
      // handlers and are intentionally left alone here.
      {
        source: '/api/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
    ]
  },
}

module.exports = nextConfig