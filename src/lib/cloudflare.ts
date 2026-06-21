// Cloudflare D1 database helper
// Replaces Prisma/SQLite with Cloudflare D1 bindings

export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  ADMIN_PASSWORD: string;
}

// Get D1 from Cloudflare request context
export function getDB(request: Request): D1Database {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (request as any).env || (globalThis as any).__cloudflare_env__;
  if (env?.DB) return env.DB;
  throw new Error('D1 database binding not found');
}

export function getEnv(request: Request): Env {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (request as any).env || (globalThis as any).__cloudflare_env__;
  if (env) return env;
  return {
    DB: null as unknown as D1Database,
    STORAGE: null as unknown as R2Bucket,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'funing2026',
  };
}
