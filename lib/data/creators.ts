import type { Creator } from '../types';

/**
 * TEMPORARY STORE. No seeded records — a creator only exists here once
 * someone submits the application form in this browser session. Replaced
 * wholesale by Supabase in Task 2, at which point this file is deleted and
 * the option lists below move to the `categories` / `content_styles` tables.
 */

export const creators: Creator[] = [];

export function getCreatorById(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}

export function getPendingCreators(): Creator[] {
  return creators.filter((c) => c.status === 'applied' || c.status === 'in_review');
}

export function setCreatorStatus(id: string, status: Creator['status']): void {
  const creator = getCreatorById(id);
  if (!creator) return;
  creator.status = status;
  creator.approvedAt = status === 'approved' ? new Date().toISOString().slice(0, 10) : null;
}

export const NICHES = [
  'Beauty & Skincare',
  'Food & Beverage',
  'Fashion & Apparel',
  'Tech & Gadgets',
  'Fitness & Wellness',
  'Home & Kitchen',
  'Baby & Parenting',
  'Travel & Hospitality',
  'Pet Care',
  'Finance & Apps',
  'Jewellery',
  'Automotive',
];

export const CONTENT_STYLES = [
  'GRWM',
  'Unboxing',
  'Demo',
  'Testimonial',
  'Recipe',
  'Day-in-the-life',
  'Try-on haul',
  'Problem–solution',
  'Explainer',
];

export const LANGUAGES = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Marathi',
  'Bengali',
  'Gujarati',
  'Malayalam',
  'Punjabi',
  'Kannada',
  'Urdu',
  'Konkani',
];

export const TURNAROUND_BANDS = ['48h', '3-5 days', 'week+'];

export const SHOOT_SETUPS = ['Phone', 'Phone + lights', 'Camera setup'];

export const RATE_BANDS = ['Under ₹10k', '₹10k – ₹20k', '₹20k +'];
