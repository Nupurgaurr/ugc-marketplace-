/**
 * Shared domain types. These mirror the shape the Postgres tables /
 * API responses are expected to have once the backend exists (see
 * HANDOVER_GUIDE.md) — swapping lib/data/* for real fetches should
 * require no type changes.
 */

export type CreatorApplicationStatus = 'applied' | 'in_review' | 'approved' | 'rejected';

export type ClientAccountStatus = 'pending' | 'approved' | 'flagged' | 'rejected';

export type RequestStatus = 'requested' | 'accepted' | 'delivered' | 'approved' | 'declined';

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
  turnaround: string;
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
  categoryNeed: string;
  monthlyBudgetBand: string;
  typicalVolume: string;
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
  targetType: 'creator' | 'client';
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
}
