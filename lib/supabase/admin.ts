import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

/**
 * Service role client. Bypasses RLS entirely, so it never runs anywhere a
 * request body can steer it. Used for exactly two things: creating the auth
 * user during application submit, and BCM verifying payout details.
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
