export interface Env {
  DB: any;
  R2: any;
}

let dbInstance: any = null;
let r2Instance: any = null;

export function setDB(db: any) {
  dbInstance = db;
}

export function setR2(r2: any) {
  r2Instance = r2;
}

export function getDB(): any {
  if (!dbInstance) {
    // For edge runtime, get from globalThis
    dbInstance = (globalThis as any).env?.DB;
  }
  if (!dbInstance) {
    throw new Error('D1 database not initialized. Call setDB() or ensure env.DB is available.');
  }
  return dbInstance;
}

export function getR2(): any {
  if (!r2Instance) {
    r2Instance = (globalThis as any).env?.R2;
  }
  if (!r2Instance) {
    throw new Error('R2 bucket not initialized. Call setR2() or ensure env.R2 is available.');
  }
  return r2Instance;
}

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = getDB();
  const result = await db.prepare(sql).bind(...params).all();
  return (result.results || []) as T[];
}

export async function queryFirst<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const db = getDB();
  const result = await db.prepare(sql).bind(...params).first();
  return result as T | null;
}

export async function execute(sql: string, params: any[] = []): Promise<{ success: boolean; meta: any }> {
  const db = getDB();
  const result = await db.prepare(sql).bind(...params).run();
  return { success: result.success, meta: result.meta };
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function sanitizeForSQL(input: string): string {
  return input.replace(/'/g, "''");
}

export function parseJSON<T>(json: string | null, fallback: T): T {
  if (!json) return fallback;
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function stringifyJSON(obj: any): string {
  return JSON.stringify(obj);
}