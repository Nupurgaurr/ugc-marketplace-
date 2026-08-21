/**
 * Signed admin session cookie. Deliberately independent of Supabase Auth —
 * admins never get an `auth.users` row, so this can't piggyback on
 * `supabase.auth.getUser()`. Verification is pure signature + expiry, no
 * network call, so the same code runs in edge middleware and in Node.
 */

export const ADMIN_SESSION_COOKIE = 'bcm_admin_session';
const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

interface AdminSessionPayload {
  email: string;
  exp: number;
}

function getSigningKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set.');

  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = '';
  for (const byte of arr) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const payload: AdminSessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SECONDS,
  };
  const payloadB64 = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));

  const key = await getSigningKey();
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));

  return `${payloadB64}.${toBase64Url(signature)}`;
}

export async function verifyAdminSessionToken(token: string): Promise<{ email: string } | null> {
  const [payloadB64, signatureB64] = token.split('.');
  if (!payloadB64 || !signatureB64) return null;

  const key = await getSigningKey();
  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    fromBase64Url(signatureB64),
    new TextEncoder().encode(payloadB64)
  );
  if (!valid) return null;

  let payload: AdminSessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(fromBase64Url(payloadB64)));
  } catch {
    return null;
  }

  if (typeof payload.email !== 'string' || typeof payload.exp !== 'number') return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return { email: payload.email };
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  };
}
