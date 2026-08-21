import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@/lib/database.types';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin/session';
import { ROUTES } from '@/lib/routes';

/**
 * Refreshes the Supabase session on every request and keeps unauthenticated
 * traffic out of the portals. For creator routes this is a convenience
 * redirect, not the security boundary — RLS in Postgres is that. For
 * /admin/*, this IS the boundary: admins have no Supabase session, so
 * there's no RLS check backing them up, only the signed session cookie
 * checked below.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const session = token ? await verifyAdminSessionToken(token) : null;

    if (pathname === ROUTES.admin.login) {
      return session ? NextResponse.redirect(new URL(ROUTES.admin.creators, request.url)) : NextResponse.next();
    }

    if (!session) {
      return NextResponse.redirect(new URL(ROUTES.admin.login, request.url));
    }

    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const creatorOnly = [ROUTES.creator.dashboard, ROUTES.creator.profile, ROUTES.creator.payouts];
  if (!user && creatorOnly.some((route) => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(ROUTES.creator.login, request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|media|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)'],
};
