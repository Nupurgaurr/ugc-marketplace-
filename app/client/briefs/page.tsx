'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import ClientShell from '@/components/client/ClientShell';
import BriefsView from '@/components/client/BriefsView';
import { ROUTES } from '@/lib/routes';

export default function ClientBriefsPage() {
  return (
    <RequireAuth role="client" loginHref={ROUTES.client.login}>
      <ClientShell pageTitle="Briefs" pageSub="Post what you need and let creators pitch on it.">
        <BriefsView />
      </ClientShell>
    </RequireAuth>
  );
}
