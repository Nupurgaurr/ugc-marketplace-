import { createClient } from '@/lib/supabase/server';
import type { AdminNote, Creator } from '@/lib/types';

/**
 * BCM-side reads. These return rows only because the caller's session is in
 * the `admins` table — the policies on `creators` and `admin_notes` are what
 * decide that, not this file.
 *
 * Payout details are deliberately absent. No admin surface reads them.
 */

export interface CreatorRow extends Creator {
  category_label: string | null;
  social_handles: string[];
  sample_links: string[];
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('is_admin');
  if (error) return false;
  return data === true;
}

export async function getCreatorQueue(): Promise<CreatorRow[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('creators')
    .select(
      `*,
       categories ( label ),
       creator_social_profiles ( platform, handle ),
       creator_sample_links ( url )`
    )
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((row) => {
    const { categories, creator_social_profiles, creator_sample_links, ...creator } = row as typeof row & {
      categories: { label: string } | null;
      creator_social_profiles: { platform: string; handle: string }[];
      creator_sample_links: { url: string }[];
    };

    return {
      ...creator,
      category_label: categories?.label ?? null,
      social_handles: creator_social_profiles.map((p) => `${p.platform}: ${p.handle}`),
      sample_links: creator_sample_links.map((l) => l.url),
    };
  });
}

export async function getNotesFor(creatorId: string): Promise<AdminNote[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('admin_notes')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
