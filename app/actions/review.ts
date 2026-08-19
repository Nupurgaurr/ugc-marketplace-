'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/routes';
import type { CreatorStatus } from '@/lib/types';

export interface ReviewResult {
  ok: boolean;
  message: string;
}

const reviewSchema = z.object({
  creatorId: z.string().uuid(),
  status: z.enum(['in_review', 'approved', 'rejected']),
});

/**
 * BCM moves an application through the pipeline. This is not where the
 * permission check lives — the `admins` policy on `creators` is, and a
 * non-admin session simply updates zero rows here.
 */
export async function reviewCreator(creatorId: string, status: CreatorStatus): Promise<ReviewResult> {
  const parsed = reviewSchema.safeParse({ creatorId, status });
  if (!parsed.success) return { ok: false, message: 'Invalid review action.' };

  const supabase = createClient();
  const { data, error } = await supabase
    .from('creators')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.creatorId)
    .select('id');

  if (error) return { ok: false, message: 'Could not update this application.' };
  if (!data || data.length === 0) return { ok: false, message: 'Not permitted.' };

  revalidatePath(ROUTES.admin.creators);
  return { ok: true, message: 'Updated.' };
}

const noteSchema = z.object({
  creatorId: z.string().uuid(),
  note: z.string().trim().min(1).max(2000),
});

export async function addAdminNote(creatorId: string, note: string): Promise<ReviewResult> {
  const parsed = noteSchema.safeParse({ creatorId, note });
  if (!parsed.success) return { ok: false, message: 'Write something first.' };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: 'Not permitted.' };

  const { error } = await supabase.from('admin_notes').insert({
    creator_id: parsed.data.creatorId,
    author: user.id,
    note: parsed.data.note,
  });

  if (error) return { ok: false, message: 'Could not save that note.' };

  revalidatePath(ROUTES.admin.creators);
  return { ok: true, message: 'Note added.' };
}
