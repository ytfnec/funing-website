import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getDB, generateId, nowISO, execute, queryFirst } from '@/lib/db';
import bcrypt from 'bcryptjs';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    // Fail loudly in production instead of silently using an insecure default.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'JWT_SECRET is not set. Set it via `npx wrangler secret put JWT_SECRET` before deploying.'
      );
    }
    // Development-only fallback (never used in production).
    return new TextEncoder().encode('dev-only-insecure-secret-do-not-use-in-production!!');
  }
  return new TextEncoder().encode(secret);
}

const JWT_SECRET = getJwtSecret();
const JWT_EXPIRY = '7d';

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'editor';
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: AdminUser): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  const user = await queryFirst<AdminUser & { password_hash: string }>(
    'SELECT id, email, name, role, password_hash FROM admin_users WHERE email = ?',
    [email]
  );
  if (!user) return null;
  
  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return null;
  
  const { password_hash, ...userWithoutPassword } = user;
  await execute('UPDATE admin_users SET last_login = ? WHERE id = ?', [nowISO(), user.id]);
  return userWithoutPassword;
}

export async function createAdminUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'editor' = 'editor'
): Promise<AdminUser> {
  const passwordHash = await hashPassword(password);
  const id = generateId('admin');
  await execute(
    'INSERT INTO admin_users (id, email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, email, passwordHash, name, role, nowISO()]
  );
  return { id, email, name, role };
}

export async function getAdminUser(id: string): Promise<AdminUser | null> {
  return queryFirst<AdminUser>(
    'SELECT id, email, name, role FROM admin_users WHERE id = ?',
    [id]
  );
}

export async function updateAdminUser(
  id: string,
  data: Partial<Pick<AdminUser, 'name' | 'role'>>
): Promise<void> {
  const sets: string[] = [];
  const params: any[] = [];
  if (data.name !== undefined) { sets.push('name = ?'); params.push(data.name); }
  if (data.role !== undefined) { sets.push('role = ?'); params.push(data.role); }
  if (sets.length === 0) return;
  params.push(id);
  await execute(`UPDATE admin_users SET ${sets.join(', ')} WHERE id = ?`, params);
}

export async function changeAdminPassword(id: string, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword);
  await execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [passwordHash, id]);
}

export function requireAuth(user: AdminUser | null): asserts user is AdminUser {
  if (!user) throw new Error('Unauthorized');
}

export function requireAdmin(user: AdminUser | null): asserts user is AdminUser & { role: 'admin' } {
  requireAuth(user);
  if (user.role !== 'admin') throw new Error('Forbidden: Admin only');
}