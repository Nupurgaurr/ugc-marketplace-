import type { ReactNode } from 'react';
import DashboardShell, { type NavItem } from '@/components/shared/DashboardShell';
import { signOut } from '@/app/actions/auth';
import { ROUTES } from '@/lib/routes';

const NAV: NavItem[] = [
  { label: 'Overview', href: ROUTES.creator.dashboard },
  { label: 'Profile', href: ROUTES.creator.profile },
  { label: 'Payout details', href: ROUTES.creator.payouts },
];

export default function CreatorShell({
  pageTitle,
  pageSub,
  sessionName,
  sessionEmail,
  children,
}: {
  pageTitle: string;
  pageSub?: string;
  sessionName?: string;
  sessionEmail?: string;
  children: ReactNode;
}) {
  return (
    <DashboardShell
      portalLabel="Creator portal"
      navItems={NAV}
      sessionName={sessionName ?? ''}
      sessionEmail={sessionEmail ?? ''}
      onLogout={signOut}
      pageTitle={pageTitle}
      pageSub={pageSub}
    >
      {children}
    </DashboardShell>
  );
}
