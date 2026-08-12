'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import AdminShell from '@/components/admin/AdminShell';
import BriefQueue from '@/components/admin/BriefQueue';
import { ROUTES } from '@/lib/routes';

export default function AdminBriefsPage() {
  return (
    <RequireAuth role="admin" loginHref={ROUTES.admin.login}>
      <AdminShell pageTitle="Brief approvals" pageSub="Nothing reaches a creator until it's approved here.">
        <BriefQueue />
      </AdminShell>
    </RequireAuth>
  );
}
