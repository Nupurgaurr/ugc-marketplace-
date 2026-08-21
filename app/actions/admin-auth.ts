'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminPassword } from '@/lib/admin/credentials';
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions, createAdminSessionToken } from '@/lib/admin/session';
import { ROUTES } from '@/lib/routes';
import type { ActionResult } from '@/app/actions/auth';

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

/**
 * Separate from `sendMagicLink` on purpose: admins never touch Supabase
 * Auth. This checks email + password against the env-var-stored hashes and,
 * on success, issues our own signed session cookie.
 */
export async function adminSignIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // Same generic message for a malformed email, an unknown email, and a
  // wrong password — don't tell an attacker which part failed.
  const invalid: ActionResult = { ok: false, message: 'Invalid email or password.' };
  if (!parsed.success) return invalid;

  const { email, password } = parsed.data;
  if (!verifyAdminPassword(email, password)) return invalid;

  const token = await createAdminSessionToken(email);
  cookies().set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());

  redirect(ROUTES.admin.creators);
}

export async function adminSignOut(): Promise<void> {
  cookies().delete(ADMIN_SESSION_COOKIE);
  redirect(ROUTES.admin.login);
}
