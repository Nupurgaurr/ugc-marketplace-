'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/useAuth';
import type { Role } from '@/lib/auth/mockAuth';

/** Wraps every protected dashboard page. Redirects to that portal's own
 *  /login if there is no mock session — see lib/auth/mockAuth.ts. */
export default function RequireAuth({
  role,
  loginHref,
  children,
}: {
  role: Role;
  loginHref: string;
  children: ReactNode;
}) {
  const { session, isLoading } = useAuth(role);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace(loginHref);
    }
  }, [isLoading, session, loginHref, router]);

  if (isLoading || !session) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--bcm-ash)' }}>
        Checking session…
      </div>
    );
  }

  return <>{children}</>;
}
