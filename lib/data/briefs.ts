import type { Brief, Pitch } from '../types';
import { creators } from './creators';
import { createRequest } from './requests';
import { makeId } from '../utils';

/**
 * PROTOTYPE DATA — mirrors the `briefs` / `pitches` tables described in
 * HANDOVER_GUIDE.md. This is the reverse-direction workflow: a client posts
 * a brief, admin approves it, creators pitch on it, the client picks one.
 */
export const briefs: Brief[] = [
  {
    id: 'b_01',
    clientId: 'cl_01',
    clientBrand: 'Suvana Skincare',
    title: 'SPF range — GRWM series',
    categories: ['Beauty & Skincare'],
    contentStyles: ['GRWM', 'Unboxing'],
    languages: ['Hindi', 'English'],
    budgetBand: '₹10k – ₹20k',
    deliverables: '3 x 30s vertical, 1 photo set',
    deadline: '2026-09-05',
    description: 'Launching a new SPF range. Need honest first-impression + routine content, shot at home.',
    status: 'open',
    createdAt: '2026-08-01',
  },
  {
    id: 'b_02',
    clientId: 'cl_02',
    clientBrand: 'Northgrid Foods',
    title: 'Ready-meal launch reels',
    categories: ['Food & Beverage'],
    contentStyles: ['Recipe', 'Testimonial'],
    languages: ['Tamil', 'English'],
    budgetBand: 'Under ₹10k',
    deliverables: '4 x 20s recipe reels',
    deadline: '2026-08-28',
    description: 'Ready-meal range launching in Chennai. Want quick, honest recipe-style content.',
    status: 'open',
    createdAt: '2026-08-03',
  },
  {
    id: 'b_03',
    clientId: 'cl_03',
    clientBrand: 'Loopwear',
    title: 'Monsoon drop — try-on hauls',
    categories: ['Fashion & Apparel'],
    contentStyles: ['Try-on haul', 'GRWM'],
    languages: ['English', 'Malayalam'],
    budgetBand: '₹20k +',
    deliverables: '5 x try-on reels',
    deadline: '2026-09-12',
    description: 'New monsoon collection. Looking for high-volume try-on content across sizes.',
    status: 'pending',
    createdAt: '2026-08-09',
  },
  {
    id: 'b_04',
    clientId: 'cl_01',
    clientBrand: 'Suvana Skincare',
    title: 'Haircare refill pack — testimonials',
    categories: ['Beauty & Skincare'],
    contentStyles: ['Testimonial'],
    languages: ['Hindi', 'English'],
    budgetBand: '₹10k – ₹20k',
    deliverables: '2 x testimonial videos',
    deadline: '2026-08-20',
    description: 'Refill pack awareness push — already matched, closed to new pitches.',
    status: 'closed',
    createdAt: '2026-07-20',
  },
];

export const pitches: Pitch[] = [
  {
    id: 'p_01',
    briefId: 'b_01',
    creatorId: 'c_01',
    creatorName: 'Aisha Rahman',
    note: 'Shot an SPF launch for a skincare brand earlier this year — routine + honest first impression, exactly this format.',
    sampleLinks: ['instagram.com/reel/aisha-spf-1'],
    quotedRate: '₹14,000 for 3 videos',
    status: 'shortlisted',
    createdAt: '2026-08-02',
  },
  {
    id: 'p_02',
    briefId: 'b_01',
    creatorId: 'c_05',
    creatorName: 'Priya Nambiar',
    note: 'Mostly fashion but I shoot skincare routines too — happy to send a quick test clip first.',
    sampleLinks: ['instagram.com/reel/priya-routine'],
    quotedRate: '₹16,000 for 3 videos',
    status: 'submitted',
    createdAt: '2026-08-04',
  },
  {
    id: 'p_03',
    briefId: 'b_04',
    creatorId: 'c_01',
    creatorName: 'Aisha Rahman',
    note: 'Worked with Suvana before, know the brand voice.',
    sampleLinks: ['instagram.com/reel/aisha-haircare'],
    quotedRate: '₹9,000 for 2 videos',
    status: 'selected',
    createdAt: '2026-07-21',
  },
  {
    id: 'p_04',
    briefId: 'b_04',
    creatorId: 'c_09',
    creatorName: 'Sneha Iyer',
    note: 'Jewellery is my usual lane but I can do testimonial-style easily.',
    sampleLinks: ['instagram.com/reel/sneha-testimonial'],
    quotedRate: '₹10,000 for 2 videos',
    status: 'passed',
    createdAt: '2026-07-22',
  },
];

export function getOpenBriefs(): Brief[] {
  return briefs.filter((b) => b.status === 'open');
}

export function getPendingBriefs(): Brief[] {
  return briefs.filter((b) => b.status === 'pending');
}

export function getBriefsForClient(clientId: string): Brief[] {
  return briefs.filter((b) => b.clientId === clientId);
}

export function getBriefById(id: string): Brief | undefined {
  return briefs.find((b) => b.id === id);
}

/** Splits open briefs into ones matching the creator's own categories vs.
 *  everything else — drives the "For you" / "Everything else" tabs. */
export function getBriefsForCreator(creatorId: string): { matched: Brief[]; other: Brief[] } {
  const creator = creators.find((c) => c.id === creatorId);
  const open = getOpenBriefs();
  if (!creator) return { matched: [], other: open };
  const matched = open.filter((b) => b.categories.includes(creator.category));
  const other = open.filter((b) => !b.categories.includes(creator.category));
  return { matched, other };
}

export function approveBrief(id: string): void {
  const brief = briefs.find((b) => b.id === id);
  if (brief) brief.status = 'open';
}

export function rejectBrief(id: string): void {
  const brief = briefs.find((b) => b.id === id);
  if (brief) brief.status = 'rejected';
}

export function createBrief(input: Omit<Brief, 'id' | 'createdAt' | 'status'>): Brief {
  const brief: Brief = { ...input, id: makeId('b'), status: 'pending', createdAt: new Date().toISOString().slice(0, 10) };
  briefs.unshift(brief);
  return brief;
}

export function getPitchesForBrief(briefId: string): Pitch[] {
  return pitches.filter((p) => p.briefId === briefId);
}

export function getPitchesForCreator(creatorId: string): Pitch[] {
  return pitches.filter((p) => p.creatorId === creatorId);
}

export function hasPitched(briefId: string, creatorId: string): boolean {
  return pitches.some((p) => p.briefId === briefId && p.creatorId === creatorId);
}

export function createPitch(input: Omit<Pitch, 'id' | 'createdAt' | 'status'>): Pitch {
  const pitch: Pitch = { ...input, id: makeId('p'), status: 'submitted', createdAt: new Date().toISOString().slice(0, 10) };
  pitches.unshift(pitch);
  return pitch;
}

export function setPitchStatus(id: string, status: Pitch['status']): void {
  const pitch = pitches.find((p) => p.id === id);
  if (pitch) pitch.status = status;
}

/** Selecting a pitch converts it into an accepted request, closes the brief
 *  to further pitches, and passes every other still-open pitch on it. */
export function selectPitch(pitchId: string): void {
  const pitch = pitches.find((p) => p.id === pitchId);
  if (!pitch) return;
  const brief = briefs.find((b) => b.id === pitch.briefId);
  if (!brief) return;

  pitch.status = 'selected';
  brief.status = 'closed';
  pitches
    .filter((p) => p.briefId === pitch.briefId && p.id !== pitchId && p.status !== 'passed')
    .forEach((p) => {
      p.status = 'passed';
    });

  createRequest(
    {
      clientId: brief.clientId,
      clientBrand: brief.clientBrand,
      creatorId: pitch.creatorId,
      creatorName: pitch.creatorName,
      campaign: brief.title,
      need: brief.deliverables,
    },
    'accepted'
  );
}

export const DELIVERABLE_PRESETS = [
  '3 x 30s vertical',
  '4-5 videos, mixed style',
  '1 photo set + 2 videos',
  '5+ videos, high volume',
];
