import { createClient } from '@/lib/supabase/server';
import { maskTail } from '@/lib/schemas/payout';
import type { Creator, MaskedPayoutDetails, SampleLink, SocialProfile } from '@/lib/types';

/**
 * Server-side reads for the signed-in creator. Every query here runs under
 * the user's own session, so RLS is what scopes it to their row — none of
 * these functions filter by id defensively, because the database already
 * refuses to return anyone else's.
 */

export async function getCurrentCreator(): Promise<Creator | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from('creators').select('*').maybeSingle();
  if (error) throw error;
  return data;
}

export async function getSocialProfiles(creatorId: string): Promise<SocialProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('creator_social_profiles')
    .select('*')
    .eq('creator_id', creatorId)
    .order('is_primary', { ascending: false })
    .order('created_at');

  if (error) throw error;
  return data;
}

export async function getSampleLinks(creatorId: string): Promise<SampleLink[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('creator_sample_links')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at');

  if (error) throw error;
  return data;
}

/**
 * Payout details, masked before they leave the server. The full account and
 * PAN numbers are read here and dropped on the floor; no caller ever receives
 * them, and neither is logged.
 */
export async function getMaskedPayoutDetails(creatorId: string): Promise<MaskedPayoutDetails | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('creator_payout_details')
    .select('*')
    .eq('creator_id', creatorId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const { account_number, pan_number, ...rest } = data;
  return {
    ...rest,
    account_number_last4: maskTail(account_number),
    pan_number_last4: maskTail(pan_number),
  };
}
