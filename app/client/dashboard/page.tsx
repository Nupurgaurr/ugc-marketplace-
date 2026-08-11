'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import ClientShell from '@/components/client/ClientShell';
import DashboardOverview from '@/components/client/DashboardOverview';
import { ROUTES } from '@/lib/routes';

export default function ClientDashboardPage() {
  return (
    <RequireAuth role="client" loginHref={ROUTES.client.login}>
      <ClientShell pageTitle="Overview" pageSub="Everything about your brand's activity on the marketplace.">
        <DashboardOverview />
      </ClientShell>
    </RequireAuth>
  );
}
