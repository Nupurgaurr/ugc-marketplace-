import type { Creator, ClientAccount } from '../types';
import { creators } from '../data/creators';
import { clients } from '../data/clients';
import { makeId } from '../utils';

/**
 * DEV ONLY — mock authentication.
 *
 * There is no backend yet, so "auth" here is a role-scoped localStorage
 * session plus a plain lookup/push against the in-memory mock arrays in
 * lib/data. No password is actually checked. This exists purely so the
 * three portals feel real to click through.
 *
 * Before launch this whole file is replaced by Supabase Auth (see
 * HANDOVER_GUIDE.md) — every call site (`useAuth`, `RequireAuth`) is written
 * against this same small surface so that swap does not touch components.
 */

export type Role = 'client' | 'creator' | 'admin';

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

/** Look up (or in a real backend, verify) — mock accepts any password. */
export function loginClient(email: string): { ok: true; session: Session } | { ok: false; error: string } {
  const account = clients.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
  if (!account) return { ok: false, error: 'No brand account found with that email. Register first.' };
  const session: Session = { role: 'client', id: account.id, name: account.brand, email: account.email };
  writeSession(session);
  return { ok: true, session };
}

export function loginCreator(email: string): { ok: true; session: Session } | { ok: false; error: string } {
  const account = creators.find((c) => c.email.toLowerCase() === email.trim().toLowerCase());
  if (!account) return { ok: false, error: 'No creator account found with that email. Apply first.' };
  const session: Session = { role: 'creator', id: account.id, name: account.name, email: account.email };
  writeSession(session);
  return { ok: true, session };
}

/** DEV ONLY credential. Replace with real server-side admin auth before launch. */
const ADMIN_CREDENTIALS = { username: 'admin', password: 'blackcoffee2026' };

export function loginAdmin(username: string, password: string): { ok: true; session: Session } | { ok: false; error: string } {
  if (username.trim() !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return { ok: false, error: 'Incorrect username or password.' };
  }
  const session: Session = { role: 'admin', id: 'admin', name: 'Admin', email: 'admin@blackcoffee.media' };
  writeSession(session);
  return { ok: true, session };
}

export interface ClientRegistration {
  brand: string;
  website: string;
  contactName: string;
  email: string;
  phone: string;
  categoryNeed: string;
  monthlyBudgetBand: string;
  typicalVolume: string;
}

export function registerClient(data: ClientRegistration): Session {
  const account: ClientAccount = {
    id: makeId('cl'),
    ...data,
    status: 'pending',
    submittedAt: new Date().toISOString().slice(0, 10),
  };
  clients.unshift(account);
  const session: Session = { role: 'client', id: account.id, name: account.brand, email: account.email };
  writeSession(session);
  return session;
}

export interface CreatorRegistration {
  name: string;
  city: string;
  phone: string;
  email: string;
  category: string;
  contentStyles: string[];
  languages: string[];
  handles: string[];
}

export function registerCreator(data: CreatorRegistration): Session {
  const account: Creator = {
    id: makeId('c'),
    slug: data.name.toLowerCase().trim().replace(/\s+/g, '-'),
    name: data.name,
    email: data.email,
    phone: data.phone,
    category: data.category,
    contentStyles: data.contentStyles,
    languages: data.languages,
    city: data.city,
    state: '',
    rateMin: 0,
    rateMax: 0,
    turnaround: '—',
    bio: '',
    availability: 'Pending approval',
    handles: data.handles,
    status: 'applied',
    submittedAt: new Date().toISOString().slice(0, 10),
    approvedAt: null,
    preview: { posterUrl: '/media/creators/aisha-rahman.jpg', previewUrl: '/media/creators/aisha-rahman.mp4', durationSec: 6 },
    portfolio: [],
    rating: 0,
  };
  creators.unshift(account);
  const session: Session = { role: 'creator', id: account.id, name: account.name, email: account.email };
  writeSession(session);
  return session;
}
