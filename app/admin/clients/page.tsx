'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import AdminShell from '@/components/admin/AdminShell';
import ClientQueue from '@/components/admin/ClientQueue';
import { ROUTES } from '@/lib/routes';

export default function AdminClientsPage() {
  return (
    <RequireAuth role="admin" loginHref={ROUTES.admin.login}>
      <AdminShell pageTitle="Client approvals" pageSub="Light moderation for brand safety, spam and fraud.">
        <ClientQueue />
      </AdminShell>
    </RequireAuth>
  );
}
