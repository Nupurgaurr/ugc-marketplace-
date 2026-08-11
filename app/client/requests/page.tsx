'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import ClientShell from '@/components/client/ClientShell';
import RequestsView from '@/components/client/RequestsView';
import { ROUTES } from '@/lib/routes';

export default function ClientRequestsPage() {
  return (
    <RequireAuth role="client" loginHref={ROUTES.client.login}>
      <ClientShell pageTitle="Requests" pageSub="Every creator you've requested and where it stands.">
        <RequestsView />
      </ClientShell>
    </RequireAuth>
  );
}
