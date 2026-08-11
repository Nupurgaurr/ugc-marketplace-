'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell, { type NavItem } from '@/components/shared/DashboardShell';
import { useAuth } from '@/lib/auth/useAuth';
import { ROUTES } from '@/lib/routes';

const NAV: NavItem[] = [
  { label: 'Overview', href: ROUTES.client.dashboard },
  { label: 'Discover creators', href: ROUTES.client.discover },
  { label: 'Shortlist', href: ROUTES.client.shortlist },
  { label: 'Requests', href: ROUTES.client.requests },
  { label: 'Post a brief', href: ROUTES.client.brief },
];

export default function ClientShell({
  pageTitle,
  pageSub,
  children,
}: {
  pageTitle: string;
  pageSub?: string;
  children: ReactNode;
}) {
  const { session, signOut } = useAuth('client');
  const router = useRouter();

  return (
    <DashboardShell
      portalLabel="Brand portal"
      navItems={NAV}
      sessionName={session?.name ?? ''}
      sessionEmail={session?.email ?? ''}
      onLogout={() => {
        signOut();
        router.push(ROUTES.client.login);
      }}
      pageTitle={pageTitle}
      pageSub={pageSub}
    >
      {children}
    </DashboardShell>
  );
}
