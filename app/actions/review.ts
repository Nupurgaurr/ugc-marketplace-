'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase/admin';
import { getAdminSession } from '@/lib/admin/guard';
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
 * BCM moves an application through the pipeline. The service-role client
 * bypasses RLS, so the admin session check below is the permission check —
 * unlike before, there's no Postgres policy backstopping this.
 */
export async function reviewCreator(creatorId: string, status: CreatorStatus): Promise<ReviewResult> {
  if (!(await getAdminSession())) return { ok: false, message: 'Not permitted.' };

  const parsed = reviewSchema.safeParse({ creatorId, status });
  if (!parsed.success) return { ok: false, message: 'Invalid review action.' };

  const supabase = createAdminClient();
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

/**
 * Not wired into any UI yet. Left unfinished: `admin_notes.author` is a
 * not-null FK to auth.users, and admins no longer have an auth.users row
 * (see lib/admin/session.ts), so this insert will fail until that column is
 * migrated to something that can hold an admin's identity.
 */
export async function addAdminNote(creatorId: string, note: string): Promise<ReviewResult> {
  const session = await getAdminSession();
  if (!session) return { ok: false, message: 'Not permitted.' };

  const parsed = noteSchema.safeParse({ creatorId, note });
  if (!parsed.success) return { ok: false, message: 'Write something first.' };

  const supabase = createAdminClient();
  const { error } = await supabase.from('admin_notes').insert({
    creator_id: parsed.data.creatorId,
    author: session.email,
    note: parsed.data.note,
  });

  if (error) return { ok: false, message: 'Could not save that note.' };

  revalidatePath(ROUTES.admin.creators);
  return { ok: true, message: 'Note added.' };
}
