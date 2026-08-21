import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

/**
 * Service role client. Bypasses RLS entirely, so it never runs anywhere a
 * request body can steer it unchecked. Used for: creating the auth user
 * during application submit, BCM verifying payout details, and all
 * admin-side creator reads/writes (lib/data/admin.ts, app/actions/review.ts)
 * — admins authenticate via lib/admin/session.ts, not Supabase Auth, so
 * there's no RLS-eligible session for them to run under.
 *
 * `server-only` makes importing this from a client component a build error.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
