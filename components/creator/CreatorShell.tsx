'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell, { type NavItem } from '@/components/shared/DashboardShell';
import { useAuth } from '@/lib/auth/useAuth';
import { ROUTES } from '@/lib/routes';

const NAV: NavItem[] = [
  { label: 'Overview', href: ROUTES.creator.dashboard },
  { label: 'Profile', href: ROUTES.creator.profile },
];

export default function CreatorShell({
  pageTitle,
  pageSub,
  children,
}: {
  pageTitle: string;
  pageSub?: string;
  children: ReactNode;
}) {
  const { session, signOut } = useAuth('creator');
  const router = useRouter();

  return (
    <DashboardShell
      portalLabel="Creator portal"
      navItems={NAV}
      sessionName={session?.name ?? ''}
      sessionEmail={session?.email ?? ''}
      onLogout={() => {
        signOut();
        router.push(ROUTES.creator.login);
      }}
      pageTitle={pageTitle}
      pageSub={pageSub}
    >
      {children}
    </DashboardShell>
  );
}
