// Shared helpers for resolving asset URLs (product hero images, news covers,
// media-library r2 keys, etc.) to a usable <img src>.
//
// Stored values may be any of:
//   - a full URL    https://media.fnec.net/products/foo.webp
//   - a local path  /assets/hero.webp
//   - a bare R2 key media/abc123.webp   (prefixed by NEXT_PUBLIC_R2_PUBLIC_URL)
//
// NEXT_PUBLIC_R2_PUBLIC_URL is inlined by Next.js at build time, so this is
// safe to import from client components.

export const R2_PUBLIC_URL = (process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '').replace(/\/+$/, '');

export function resolveImageSrc(raw: string | null | undefined): string {
  if (!raw) return '';
  const value = raw.trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('/')) return value;
  if (R2_PUBLIC_URL) return `${R2_PUBLIC_URL}/${value.replace(/^\/+/, '')}`;
  return value;
}
