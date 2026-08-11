'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import AdminShell from '@/components/admin/AdminShell';
import CreatorQueue from '@/components/admin/CreatorQueue';
import { ROUTES } from '@/lib/routes';

export default function AdminCreatorsPage() {
  return (
    <RequireAuth role="admin" loginHref={ROUTES.admin.login}>
      <AdminShell pageTitle="Creator approvals" pageSub="Approve, reject, and manage every creator on the platform.">
        <CreatorQueue />
      </AdminShell>
    </RequireAuth>
  );
}
