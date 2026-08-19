import type { Creator } from '../types';
import { creators } from '../data/creators';
import { makeId } from '../utils';

/**
 * TEMPORARY AUTH. A role-scoped localStorage session over the in-memory
 * store in lib/data/creators.ts. No password is verified. Deleted in Task 2
 * when Supabase Auth (email magic link) replaces it — `useAuth` and
 * `RequireAuth` are the only call sites.
 */

export type Role = 'creator' | 'admin';

export interface Session {
  role: Role;
  id: string;
  name: string;
  email: string;
}

const sessionKey = (role: Role) => `bcm_session_${role}`;

function readSession(role: Role): Session | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(sessionKey(role));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

function writeSession(session: Session) {
  window.localStorage.setItem(sessionKey(session.role), JSON.stringify(session));
  window.dispatchEvent(new Event('bcm-session-change'));
}

export function getSession(role: Role): Session | null {
  return readSession(role);
}

export function logout(role: Role) {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(sessionKey(role));
  window.dispatchEvent(new Event('bcm-session-change'));
}

export function loginCreator(email: string): { ok: true; session: Session } | { ok: false; error: string } {
  const account = creators.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
  if (!account) return { ok: false, error: 'No creator account found with that email. Apply first.' };
  const session: Session = { role: 'creator', id: account.id, name: account.name, email: account.email };
  writeSession(session);
  return { ok: true, session };
}

const ADMIN_CREDENTIALS = { username: 'admin', password: 'blackcoffee2026' };

export function loginAdmin(username: string, password: string): { ok: true; session: Session } | { ok: false; error: string } {
  if (username.trim() !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return { ok: false, error: 'Incorrect username or password.' };
  }
  const session: Session = { role: 'admin', id: 'admin', name: 'Admin', email: 'admin@blackcoffee.media' };
  writeSession(session);
  return { ok: true, session };
}

export interface CreatorRegistration {
  name: string;
  city: string;
  phone: string;
  email: string;
  category: string;
  contentStyles: string[];
  languages: string[];
  shootSetup: string;
  turnaround: string;
  rateBand: string;
  handles: string[];
}

export function registerCreator(data: CreatorRegistration): Session {
  const account: Creator = {
    id: makeId('c'),
    ...data,
    bio: '',
    availability: '',
    status: 'applied',
    submittedAt: new Date().toISOString().slice(0, 10),
    approvedAt: null,
  };
  creators.unshift(account);
  const session: Session = { role: 'creator', id: account.id, name: account.name, email: account.email };
  writeSession(session);
  return session;
}
