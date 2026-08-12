/**
 * Shared domain types. These mirror the shape the Postgres tables /
 * API responses are expected to have once the backend exists (see
 * HANDOVER_GUIDE.md) — swapping lib/data/* for real fetches should
 * require no type changes.
 */

export type CreatorApplicationStatus = 'applied' | 'in_review' | 'approved' | 'rejected';

export type ClientAccountStatus = 'pending' | 'approved' | 'flagged' | 'rejected';

export type RequestStatus = 'requested' | 'accepted' | 'delivered' | 'approved' | 'declined';

export type BriefStatus = 'pending' | 'open' | 'closed' | 'rejected';

export type PitchStatus = 'submitted' | 'shortlisted' | 'selected' | 'passed';

export interface CreatorPreview {
  posterUrl: string;
  previewUrl: string;
  durationSec: number;
}

export interface PortfolioItem extends CreatorPreview {
  id: string;
  title: string;
  style: string;
}

export interface Creator {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  contentStyles: string[];
  languages: string[];
  city: string;
  state: string;
  rateMin: number;
  rateMax: number;
  /** One of TURNAROUND_BANDS (lib/data/creators.ts) — also a /discover filter. */
  turnaround: string;
  /** One of SHOOT_SETUPS (lib/data/creators.ts). */
  shootSetup: string;
  bio: string;
  availability: string;
  handles: string[];
  status: CreatorApplicationStatus;
  submittedAt: string;
  approvedAt: string | null;
  preview: CreatorPreview;
  portfolio: PortfolioItem[];
  rating: number;
}

export interface ClientAccount {
  id: string;
  brand: string;
  website: string;
  contactName: string;
  email: string;
  phone: string;
  /** Multi-select industries/categories — replaces the old single categoryNeed. */
  industries: string[];
  /** Where the brand sells — D2C site / marketplace / retail / app. */
  sellsWhere: string[];
  targetLanguages: string[];
  contentStylesNeeded: string[];
  monthlyBudgetBand: string;
  typicalVolume: string;
  /** organic only / paid ads / whitelisting */
  usageRights: string;
  status: ClientAccountStatus;
  submittedAt: string;
}

export interface MatchRequest {
  id: string;
  clientId: string;
  clientBrand: string;
  creatorId: string;
  creatorName: string;
  campaign: string;
  need: string;
  status: RequestStatus;
  createdAt: string;
}

export interface AdminNote {
  id: string;
  targetType: 'creator' | 'client' | 'brief';
  targetId: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface FilterSelection {
  category: string[];
  contentStyle: string[];
  language: string[];
  location: string[];
  rate: string[];
  turnaround: string[];
}

export interface Brief {
  id: string;
  clientId: string;
  clientBrand: string;
  title: string;
  categories: string[];
  contentStyles: string[];
  languages: string[];
  budgetBand: string;
  /** e.g. "3 x 30s vertical, 1 photo set" */
  deliverables: string;
  deadline: string;
  description: string;
  status: BriefStatus;
  createdAt: string;
}

export interface Pitch {
  id: string;
  briefId: string;
  creatorId: string;
  creatorName: string;
  /** Max 400 chars, enforced in the submit form. */
  note: string;
  /** Max 3, enforced in the submit form. */
  sampleLinks: string[];
  quotedRate: string;
  status: PitchStatus;
  createdAt: string;
}
