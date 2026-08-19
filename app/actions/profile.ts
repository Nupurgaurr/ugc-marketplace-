'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/lib/database.types';
import { creatorProfileSchema, type CreatorProfile } from '@/lib/schemas/creator';
import { payoutDetailsSchema, type PayoutDetailsInput } from '@/lib/schemas/payout';
import { ROUTES } from '@/lib/routes';

export interface SaveResult {
  ok: boolean;
  message: string;
}

async function currentCreatorId(): Promise<string | null> {
  const supabase = createClient();
  const { data } = await supabase.from('creators').select('id').maybeSingle();
  return data?.id ?? null;
}

export async function saveProfile(input: CreatorProfile): Promise<SaveResult> {
  const parsed = creatorProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const profile = parsed.data;
  const supabase = createClient();
  const creatorId = await currentCreatorId();
  if (!creatorId) return { ok: false, message: 'Log in karo pehle.' };

  const { error } = await supabase
    .from('creators')
    .update({
      bio: profile.bio,
      availability: profile.availability,
      category_id: profile.categoryId,
      content_styles: profile.contentStyles,
      languages: profile.languages,
    })
    .eq('id', creatorId);

  if (error) return { ok: false, message: 'Save nahi hua. Dobara try karo.' };

  // Social profiles and sample links are small, fully-owned sets. Replacing
  // them wholesale is simpler than diffing, and RLS scopes the delete.
  await supabase.from('creator_social_profiles').delete().eq('creator_id', creatorId);
  const { error: socialError } = await supabase.from('creator_social_profiles').insert(
    profile.socialProfiles.map((p) => ({
      creator_id: creatorId,
      platform: p.platform,
      handle: p.handle,
      is_primary: p.platform === 'instagram',
    }))
  );
  if (socialError) return { ok: false, message: 'Social profiles save nahi hue.' };

  await supabase.from('creator_sample_links').delete().eq('creator_id', creatorId);
  if (profile.sampleLinks.length > 0) {
    const { error: linkError } = await supabase
      .from('creator_sample_links')
      .insert(profile.sampleLinks.map((url) => ({ creator_id: creatorId, url })));
    if (linkError) return { ok: false, message: 'Sample links save nahi hue.' };
  }

  revalidatePath(ROUTES.creator.profile);
  return { ok: true, message: 'Save ho gaya.' };
}

/**
 * Writes payout details. Nothing in this function logs its input: the whole
 * argument is financial and identity data.
 */
export async function savePayoutDetails(input: PayoutDetailsInput): Promise<SaveResult> {
  const parsed = payoutDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const details = parsed.data;
  const supabase = createClient();
  const creatorId = await currentCreatorId();
  if (!creatorId) return { ok: false, message: 'Log in karo pehle.' };

  const row: Database['public']['Tables']['creator_payout_details']['Insert'] =
    details.method === 'bank'
      ? {
          creator_id: creatorId,
          method: 'bank',
          account_holder_name: details.accountHolderName,
          account_number: details.accountNumber,
          ifsc: details.ifsc,
          upi_id: null,
          pan_number: details.panNumber,
        }
      : {
          creator_id: creatorId,
          method: 'upi',
          account_holder_name: null,
          account_number: null,
          ifsc: null,
          upi_id: details.upiId,
          pan_number: details.panNumber,
        };

  const { error } = await supabase
    .from('creator_payout_details')
    .upsert(row, { onConflict: 'creator_id' });

  if (error) return { ok: false, message: 'Save nahi hua. Details dobara check karo.' };

  revalidatePath(ROUTES.creator.payouts);
  return { ok: true, message: 'Payout details save ho gaye.' };
}
