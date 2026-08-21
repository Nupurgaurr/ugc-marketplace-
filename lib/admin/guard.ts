import 'server-only';
import { cookies } from 'next/headers';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin/session';

/** Server Components and Server Actions only — reads the session cookie via
 *  `next/headers`, which middleware (edge runtime) can't use. */
export async function getAdminSession(): Promise<{ email: string } | null> {
  const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}
