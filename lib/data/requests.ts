import type { AdminNote, MatchRequest } from '../types';
import { makeId } from '../utils';

/** PROTOTYPE DATA — mirrors the `requests` table. Moves through the states
 *  named in the report: requested → accepted → delivered → approved. */
export const requests: MatchRequest[] = [
  {
    id: 'r_01',
    clientId: 'cl_01',
    clientBrand: 'Suvana Skincare',
    creatorId: 'c_01',
    creatorName: 'Aisha Rahman',
    campaign: 'SPF range launch',
    need: '3 videos · Unboxing + routine · Hindi',
    status: 'requested',
    createdAt: '2026-08-06',
  },
  {
    id: 'r_02',
    clientId: 'cl_01',
    clientBrand: 'Suvana Skincare',
    creatorId: 'c_04',
    creatorName: 'Devanshi Patel',
    campaign: 'Haircare refill pack',
    need: '2 videos · Testimonial · Hindi + English',
    status: 'accepted',
    createdAt: '2026-07-28',
  },
  {
    id: 'r_03',
    clientId: 'cl_02',
    clientBrand: 'Northgrid Foods',
    creatorId: 'c_03',
    creatorName: 'Meera Suresh',
    campaign: 'Ready-meal range',
    need: '4 videos · Recipe · Tamil',
    status: 'delivered',
    createdAt: '2026-07-10',
  },
  {
    id: 'r_04',
    clientId: 'cl_02',
    clientBrand: 'Northgrid Foods',
    creatorId: 'c_09',
    creatorName: 'Sneha Iyer',
    campaign: 'Festive gifting set',
    need: '2 videos · Unboxing · Tamil + English',
    status: 'approved',
    createdAt: '2026-06-02',
  },
];

export function getRequestsForClient(clientId: string): MatchRequest[] {
  return requests.filter((r) => r.clientId === clientId);
}

export function getRequestsForCreator(creatorId: string): MatchRequest[] {
  return requests.filter((r) => r.creatorId === creatorId);
}

export function updateRequestStatus(id: string, status: MatchRequest['status']): void {
  const request = requests.find((r) => r.id === id);
  if (request) request.status = status;
}

export function createRequest(input: Omit<MatchRequest, 'id' | 'createdAt' | 'status'>): MatchRequest {
  const request: MatchRequest = {
    ...input,
    id: makeId('r'),
    status: 'requested',
    createdAt: new Date().toISOString().slice(0, 10),
  };
  requests.unshift(request);
  return request;
}

/** PROTOTYPE DATA — private, admin-only notes. Never shown to creators or clients. */
export const adminNotes: AdminNote[] = [
  {
    id: 'n_01',
    targetType: 'creator',
    targetId: 'c_13',
    body: 'Sample links look clean, checking one more testimonial before approving.',
    author: 'Admin',
    createdAt: '2026-08-06',
  },
];

export function getNotesFor(targetType: 'creator' | 'client', targetId: string): AdminNote[] {
  return adminNotes.filter((n) => n.targetType === targetType && n.targetId === targetId);
}

export function addNote(targetType: 'creator' | 'client', targetId: string, body: string, author = 'Admin'): AdminNote {
  const note: AdminNote = {
    id: makeId('n'),
    targetType,
    targetId,
    body,
    author,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  adminNotes.unshift(note);
  return note;
}
