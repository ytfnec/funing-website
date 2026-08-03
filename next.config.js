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
      // edge (60s, stale-while-revalidate). These are ISR pages whose content
      // changes at most every 300s, so edge-caching cuts Worker SSR traffic —
      // the fix for recurring 1102 / SSR timeout on the free tier.
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=300' },
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