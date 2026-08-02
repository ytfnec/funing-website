import { query } from '@/lib/db';

export type NewsStatus = 'draft' | 'published';

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string | null;
  status: NewsStatus;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// The canonical column set the app expects. The deployed D1 may contain a
// `news_article` table created by the previous site that predates this schema,
// so we introspect the live columns at runtime and only touch the ones that
// exist. This lets the feature degrade gracefully (missing optional columns
// fall back to defaults) instead of 500ing on every query.
export const NEWS_FIELDS = [
  'id',
  'slug',
  'title',
  'excerpt',
  'content',
  'cover_image',
  'author',
  'status',
  'published_at',
  'created_at',
  'updated_at',
] as const;

export type NewsField = (typeof NEWS_FIELDS)[number];

let columnsPromise: Promise<string[]> | null = null;

export function getNewsColumns(): Promise<string[]> {
  if (!columnsPromise) {
    columnsPromise = query<{ name: string }>('PRAGMA table_info(news_article)')
      .then((rows) => rows.map((r) => r.name))
      .catch(() => []);
  }
  return columnsPromise;
}

// Reset so tests / re-initialized bindings re-probe. (Not used at runtime —
// mainly useful in dev when the local D1 is re-seeded.)
export function resetNewsColumns(): void {
  columnsPromise = null;
}

/** Column names from `fields` that actually exist on the live table. */
export async function availableFields(fields: readonly NewsField[]): Promise<NewsField[]> {
  const cols = new Set(await getNewsColumns());
  return fields.filter((f) => cols.has(f));
}

/** Build a `SELECT` column list restricted to the columns that exist. */
export async function buildSelect(fields: readonly NewsField[]): Promise<string> {
  const cols = await availableFields(fields);
  return cols.join(', ');
}

export function normalizeArticle(
  row: Record<string, unknown> | null | undefined
): NewsArticle | null {
  if (!row) return null;
  const statusRaw = (row.status as string) ?? 'draft';
  return {
    id: (row.id as string) ?? '',
    slug: (row.slug as string) ?? '',
    title: (row.title as string) ?? '',
    excerpt: (row.excerpt as string | null) ?? null,
    content: (row.content as string) ?? '',
    cover_image: (row.cover_image as string | null) ?? null,
    author: (row.author as string | null) ?? null,
    status: statusRaw === 'published' ? 'published' : 'draft',
    published_at: (row.published_at as string | null) ?? null,
    created_at: (row.created_at as string | null) ?? null,
    updated_at: (row.updated_at as string | null) ?? null,
  };
}

/** Human-friendly date string, or '' when the value is missing. */
export function formatNewsDate(date: string | null | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}
