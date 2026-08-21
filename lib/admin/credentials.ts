import 'server-only';
import { scryptSync, timingSafeEqual } from 'node:crypto';

/**
 * The two people allowed through the admin login. The addresses aren't
 * secret; the passwords are — those live only as scrypt hashes in env vars,
 * generated with `npm run admin:hash-password`. Nothing here ever holds a
 * plaintext password.
 */
const ADMIN_ACCOUNTS = [
  { email: 'dhruv@blackcoffee.media', passwordHashEnvVar: 'ADMIN_DHRUV_PASSWORD_HASH' },
  { email: 'nupur@blackcoffee.media', passwordHashEnvVar: 'ADMIN_NUPUR_PASSWORD_HASH' },
] as const;

export function isAllowedAdminEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ADMIN_ACCOUNTS.some((account) => account.email === normalized);
}

export function verifyAdminPassword(email: string, password: string): boolean {
  const normalized = email.trim().toLowerCase();
  const account = ADMIN_ACCOUNTS.find((a) => a.email === normalized);
  if (!account) return false;

  const stored = process.env[account.passwordHashEnvVar];
  if (!stored) return false;

  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;

  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const derived = scryptSync(password, salt, expected.length);

  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
