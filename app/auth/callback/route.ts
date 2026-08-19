import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/lib/routes';

/** Where a magic link lands. Exchanges the one-time token for a session
 *  cookie, then sends the person on to whatever they were signing in for. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get('token_hash');
  const next = searchParams.get('next') ?? ROUTES.creator.dashboard;

  if (!tokenHash) {
    return NextResponse.redirect(new URL(`${ROUTES.creator.login}?error=missing_token`, origin));
  }

  const supabase = createClient();
  const { error } = await supabase.auth.verifyOtp({ type: 'email', token_hash: tokenHash });

  if (error) {
    return NextResponse.redirect(new URL(`${ROUTES.creator.login}?error=expired`, origin));
  }

  return NextResponse.redirect(new URL(next, origin));
}
