import { RATE_BANDS, SHOOT_SETUPS, TURNAROUNDS } from '@/lib/schemas/creator';

/**
 * Labels for the fixed enums. Categories and content styles are not here:
 * those are BCM-editable and read from the database.
 */

export const SHOOT_SETUP_OPTIONS = [
  { value: SHOOT_SETUPS[0], label: 'Phone' },
  { value: SHOOT_SETUPS[1], label: 'Phone + lights' },
  { value: SHOOT_SETUPS[2], label: 'Camera setup' },
] as const;

export const TURNAROUND_OPTIONS = [
  { value: TURNAROUNDS[0], label: '48 hours' },
  { value: TURNAROUNDS[1], label: '3 to 5 days' },
  { value: TURNAROUNDS[2], label: 'A week or more' },
] as const;

export const RATE_BAND_OPTIONS = [
  { value: RATE_BANDS[0], label: 'Under ₹10k' },
  { value: RATE_BANDS[1], label: '₹10k to ₹20k' },
  { value: RATE_BANDS[2], label: '₹20k and up' },
] as const;

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  x: 'X',
  snapchat: 'Snapchat',
  website: 'Website',
};
