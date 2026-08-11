'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import AdminShell from '@/components/admin/AdminShell';
import Reports from '@/components/admin/Reports';
import { ROUTES } from '@/lib/routes';

export default function AdminReportsPage() {
  return (
    <RequireAuth role="admin" loginHref={ROUTES.admin.login}>
      <AdminShell pageTitle="Reports" pageSub="Platform numbers at a glance.">
        <Reports />
      </AdminShell>
    </RequireAuth>
  );
}
