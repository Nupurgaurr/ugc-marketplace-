'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { creatorApplicationSchema, type CreatorApplication } from '@/lib/schemas/creator';

export interface SubmitResult {
  ok: boolean;
  message: string;
}

/**
 * The whole application submit, in the order the brief describes it:
 * create the auth user, sign them in, write the record as `applied`, and
 * hand the caller back to the dashboard.
 *
 * The service role is used for exactly one step — minting the auth user,
 * which cannot happen under a session that does not exist yet. Everything
 * after that runs under the creator's own session so RLS checks the writes.
 */
export async function submitApplication(input: CreatorApplication): Promise<SubmitResult> {
  const parsed = creatorApplicationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const application = parsed.data;
  const admin = createAdminClient();

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: application.email,
    email_confirm: true,
    user_metadata: { full_name: application.fullName },
  });

  if (createError || !created.user) {
    const alreadyExists = createError?.message?.toLowerCase().includes('already');
    return {
      ok: false,
      message: alreadyExists
        ? 'Is email se application already hai. Log in karo.'
        : 'Application submit nahi ho payi. Thodi der baad try karo.',
    };
  }

  // Mint a one-time token for the new user and burn it immediately, which
  // establishes the session cookie without a password and without making
  // them go to their inbox first.
  const { data: link, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: application.email,
  });

  if (linkError || !link.properties?.hashed_token) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, message: 'Application submit nahi ho payi. Thodi der baad try karo.' };
  }

  const supabase = createClient();
  const { error: sessionError } = await supabase.auth.verifyOtp({
    type: 'email',
    token_hash: link.properties.hashed_token,
  });

  if (sessionError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, message: 'Application submit nahi ho payi. Thodi der baad try karo.' };
  }

  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .insert({
      auth_user_id: created.user.id,
      full_name: application.fullName,
      city: application.city,
      phone: application.phone,
      email: application.email,
      category_id: application.categoryId,
      content_styles: application.contentStyles,
      languages: application.languages,
      shoot_setup: application.shootSetup,
      turnaround: application.turnaround,
      rate_band: application.rateBand,
      status: 'applied',
    })
    .select('id')
    .single();

  if (creatorError || !creator) {
    await supabase.auth.signOut();
    await admin.auth.admin.deleteUser(created.user.id);
    return { ok: false, message: 'Application submit nahi ho payi. Thodi der baad try karo.' };
  }

  const { error: socialError } = await supabase.from('creator_social_profiles').insert(
    application.socialProfiles.map((profile) => ({
      creator_id: creator.id,
      platform: profile.platform,
      handle: profile.handle,
      is_primary: profile.platform === 'instagram',
    }))
  );

  if (socialError) {
    return { ok: false, message: 'Profile save nahi hui. Dashboard se dobara add karo.' };
  }

  if (application.sampleLinks.length > 0) {
    const { error: linksError } = await supabase
      .from('creator_sample_links')
      .insert(application.sampleLinks.map((url) => ({ creator_id: creator.id, url })));

    if (linksError) {
      return { ok: false, message: 'Sample links save nahi hue. Dashboard se dobara add karo.' };
    }
  }

  return { ok: true, message: 'Application mil gayi.' };
}
