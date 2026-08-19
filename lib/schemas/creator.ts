import { z } from 'zod';
import { normaliseHandle, validateHandle } from '@/lib/social';

/**
 * Defined once, imported by both the application form and the server action
 * that writes it. The CHECK constraints in supabase/migrations mirror these
 * rules; this layer exists to give a person a useful message before the
 * database refuses the row.
 */

export const SHOOT_SETUPS = ['phone', 'phone_lights', 'camera'] as const;
export const TURNAROUNDS = ['48h', '3_5_days', 'week_plus'] as const;
export const RATE_BANDS = ['under_10k', '10k_20k', '20k_plus'] as const;

export const SOCIAL_PLATFORMS = [
  'instagram',
  'youtube',
  'tiktok',
  'facebook',
  'linkedin',
  'x',
  'snapchat',
  'website',
] as const;

/** A pasted profile URL is reduced to a handle before it is validated, so
 *  the same account entered two different ways stores identically. */
export const socialProfileSchema = z
  .object({
    platform: z.enum(SOCIAL_PLATFORMS),
    handle: z.string().trim().min(1, 'Handle chahiye.').max(200),
    followerCount: z
      .number()
      .int()
      .min(0)
      .max(1_000_000_000, 'Ye number thoda zyada lag raha hai.')
      .nullable()
      .default(null),
  })
  .transform((profile) => ({
    ...profile,
    handle: normaliseHandle(profile.platform, profile.handle),
  }))
  .superRefine((profile, ctx) => {
    const problem = validateHandle(profile.platform, profile.handle);
    if (problem) {
      ctx.addIssue({ code: 'custom', message: problem, path: ['handle'] });
    }
  });

const socialProfilesSchema = z
  .array(socialProfileSchema)
  .min(1, 'Instagram toh chahiye hi.')
  .max(SOCIAL_PLATFORMS.length)
  .refine((rows) => rows.some((r) => r.platform === 'instagram'), 'Instagram handle zaroori hai.')
  .refine(
    (rows) => new Set(rows.map((r) => r.platform)).size === rows.length,
    'Ek platform ek hi baar.'
  );

/** Optional, and capped at three by the same rule the database enforces. */
const sampleLinksSchema = z
  .array(z.string().trim().url('Poora link daalo, https:// ke saath.'))
  .max(3, 'Teen se zyada nahi.')
  .default([]);

export const creatorApplicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Apna pura naam likho.').max(80),
  city: z.string().trim().min(2, 'City chahiye.').max(60),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ]{10,16}$/, 'Ek valid phone number daalo.'),
  email: z.string().trim().toLowerCase().email('Ye email theek nahi lag raha.'),

  categoryId: z.string().uuid('Apna category chuno.'),
  contentStyles: z.array(z.string()).min(1, 'Kam se kam ek content style chuno.'),
  languages: z.array(z.string()).min(1, 'Kam se kam ek zubaan chuno.'),

  shootSetup: z.enum(SHOOT_SETUPS, { message: 'Setup chuno.' }),
  turnaround: z.enum(TURNAROUNDS, { message: 'Turnaround chuno.' }),
  rateBand: z.enum(RATE_BANDS, { message: 'Rate band chuno.' }),

  socialProfiles: socialProfilesSchema,
  sampleLinks: sampleLinksSchema,
});

export type CreatorApplication = z.infer<typeof creatorApplicationSchema>;
/** What the form holds before Zod transforms it. */
export type CreatorApplicationInput = z.input<typeof creatorApplicationSchema>;

export const creatorProfileSchema = z.object({
  bio: z.string().trim().max(600, 'Thoda chhota karo, 600 characters tak.').default(''),
  availability: z.string().trim().max(120).default(''),
  categoryId: z.string().uuid('Apna category chuno.'),
  contentStyles: z.array(z.string()).min(1, 'Kam se kam ek content style chuno.'),
  languages: z.array(z.string()).min(1, 'Kam se kam ek zubaan chuno.'),
  socialProfiles: socialProfilesSchema,
  sampleLinks: sampleLinksSchema,
});

export type CreatorProfile = z.infer<typeof creatorProfileSchema>;
export type CreatorProfileInput = z.input<typeof creatorProfileSchema>;
