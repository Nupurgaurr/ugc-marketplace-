'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import DashboardGate from '@/components/creator/DashboardGate';
import { ROUTES } from '@/lib/routes';

export default function CreatorDashboardPage() {
  return (
    <RequireAuth role="creator" loginHref={ROUTES.creator.login}>
      <DashboardGate />
    </RequireAuth>
  );
}
