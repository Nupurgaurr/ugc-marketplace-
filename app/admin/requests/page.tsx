'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import AdminShell from '@/components/admin/AdminShell';
import RequestsTable from '@/components/admin/RequestsTable';
import { ROUTES } from '@/lib/routes';

export default function AdminRequestsPage() {
  return (
    <RequireAuth role="admin" loginHref={ROUTES.admin.login}>
      <AdminShell pageTitle="Requests" pageSub="Which client requested which creator, and the outcome.">
        <RequestsTable />
      </AdminShell>
    </RequireAuth>
  );
}
