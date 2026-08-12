'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import DashboardGate from '@/components/client/DashboardGate';
import { ROUTES } from '@/lib/routes';

export default function ClientDashboardPage() {
  return (
    <RequireAuth role="client" loginHref={ROUTES.client.login}>
      <DashboardGate />
    </RequireAuth>
  );
}
