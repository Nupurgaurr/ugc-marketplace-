'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import DashboardShell, { type NavItem } from '@/components/shared/DashboardShell';
import { useAuth } from '@/lib/auth/useAuth';
import { ROUTES } from '@/lib/routes';

const NAV: NavItem[] = [
  { label: 'Overview', href: ROUTES.admin.dashboard },
  { label: 'Creator approvals', href: ROUTES.admin.creators },
  { label: 'Client approvals', href: ROUTES.admin.clients },
  { label: 'Requests', href: ROUTES.admin.requests },
  { label: 'Reports', href: ROUTES.admin.reports },
];

export default function AdminShell({
  pageTitle,
  pageSub,
  children,
}: {
  pageTitle: string;
  pageSub?: string;
  children: ReactNode;
}) {
  const { session, signOut } = useAuth('admin');
  const router = useRouter();

  return (
    <DashboardShell
      portalLabel="Admin"
      navItems={NAV}
      sessionName={session?.name ?? ''}
      sessionEmail={session?.email ?? ''}
      onLogout={() => {
        signOut();
        router.push(ROUTES.admin.login);
      }}
      pageTitle={pageTitle}
      pageSub={pageSub}
    >
      {children}
    </DashboardShell>
  );
}
