'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import AdminShell from '@/components/admin/AdminShell';
import DashboardOverview from '@/components/admin/DashboardOverview';
import { ROUTES } from '@/lib/routes';

export default function AdminDashboardPage() {
  return (
    <RequireAuth role="admin" loginHref={ROUTES.admin.login}>
      <AdminShell pageTitle="Overview" pageSub="Platform health at a glance.">
        <DashboardOverview />
      </AdminShell>
    </RequireAuth>
  );
}
