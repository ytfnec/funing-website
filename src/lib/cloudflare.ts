// Cloudflare D1 database helper

export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  ADMIN_PASSWORD: string;
}

// Check if we're running in Cloudflare Workers
function getCloudflareEnv(): Env | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (globalThis as any).__cloudflare_env__;
    if (env) return env;
  } catch {
    // Not in Cloudflare environment
  }
  return null;
}

// Get D1 from Cloudflare request context
export function getDB(request: Request): D1Database {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfEnv = (request as any).env || getCloudflareEnv();
    if (cfEnv?.DB) return cfEnv.DB;
  } catch {
    // Not available
  }
  throw new Error('D1 database binding not found');
}

export function getEnv(request: Request): Env {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cfEnv = (request as any).env || getCloudflareEnv();
    if (cfEnv) return cfEnv;
  } catch {
    // Not available
  }
  return {
    DB: null as unknown as D1Database,
    STORAGE: null as unknown as R2Bucket,
    ADMIN_PASSWORD: 'funing2026',
  };
}
