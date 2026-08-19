/**
 * Every domain type in the app, aliased off the generated schema types in
 * lib/database.types.ts. Nothing here restates a table by hand. Change a
 * column, regenerate, and the app stops compiling at the places that care.
 */

import type { Database } from './database.types';

export type { CreatorStatus, PayoutMethod, SocialPlatform } from './database.types';

type Tables = Database['public']['Tables'];

export type Creator = Tables['creators']['Row'];
export type CreatorInsert = Tables['creators']['Insert'];
export type CreatorUpdate = Tables['creators']['Update'];

export type Category = Tables['categories']['Row'];
export type ContentStyle = Tables['content_styles']['Row'];

export type SocialProfile = Tables['creator_social_profiles']['Row'];
export type SampleLink = Tables['creator_sample_links']['Row'];

export type PayoutDetails = Tables['creator_payout_details']['Row'];
export type AdminNote = Tables['admin_notes']['Row'];

/**
 * What the payout tab is allowed to render. The account number never leaves
 * the server intact: the route handler masks it to the last four digits
 * before it reaches any client component.
 */
export type MaskedPayoutDetails = Omit<PayoutDetails, 'account_number' | 'pan_number'> & {
  account_number_last4: string | null;
  pan_number_last4: string | null;
};
