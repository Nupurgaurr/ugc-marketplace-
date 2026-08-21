import type { ReactNode } from 'react';
import DashboardShell, { type NavItem } from '@/components/shared/DashboardShell';
import { adminSignOut } from '@/app/actions/admin-auth';
import { ROUTES } from '@/lib/routes';

const NAV: NavItem[] = [{ label: 'Creator approvals', href: ROUTES.admin.creators }];

export default function AdminShell({
  pageTitle,
  pageSub,
  sessionEmail,
  children,
}: {
  pageTitle: string;
  pageSub?: string;
  sessionEmail?: string;
  children: ReactNode;
}) {
  return (
    <DashboardShell
      portalLabel="Admin"
      navItems={NAV}
      sessionName="BCM"
      sessionEmail={sessionEmail ?? ''}
      onLogout={adminSignOut}
      pageTitle={pageTitle}
      pageSub={pageSub}
    >
      {children}
    </DashboardShell>
  );
}
