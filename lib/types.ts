/**
 * Shared domain types. Replaced in Task 2 by types generated from the
 * Supabase schema — nothing here is hand-maintained past that point.
 */

export type CreatorApplicationStatus = 'applied' | 'in_review' | 'approved' | 'rejected';

export interface Creator {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  contentStyles: string[];
  languages: string[];
  city: string;
  rateBand: string;
  turnaround: string;
  shootSetup: string;
  bio: string;
  availability: string;
  handles: string[];
  status: CreatorApplicationStatus;
  submittedAt: string;
  approvedAt: string | null;
}

export interface AdminNote {
  id: string;
  creatorId: string;
  body: string;
  author: string;
  createdAt: string;
}
