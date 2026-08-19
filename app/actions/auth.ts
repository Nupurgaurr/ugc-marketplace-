'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/routes';

const emailSchema = z.string().trim().toLowerCase().email('Ye email theek nahi lag raha.');

export interface ActionResult {
  ok: boolean;
  message: string;
}

/**
 * Sends a magic link. Supabase delivers it over the SMTP provider configured
 * in the dashboard, which is Resend.
 *
 * `shouldCreateUser: false` matters: this is the returning-creator door, and
 * without it anyone could mint an auth user with no application behind it.
 */
export async function sendMagicLink(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = emailSchema.safeParse(formData.get('email'));
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  // Only the two destinations the product has. Never trust a path off the
  // form body, or this becomes an open redirect.
  const isAdmin = formData.get('portal') === 'admin';
  const next = isAdmin ? ROUTES.admin.creators : ROUTES.creator.dashboard;

  const origin = headers().get('origin') ?? '';
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${origin}/auth/callback?next=${next}`,
    },
  });

  if (error) {
    return {
      ok: false,
      message: isAdmin
        ? 'No account for that address.'
        : 'Is email par koi application nahi mili. Pehle apply karo.',
    };
  }

  return {
    ok: true,
    message: isAdmin ? 'Link sent. Check your inbox.' : 'Link bhej diya. Apna inbox dekho.',
  };
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.home);
}
