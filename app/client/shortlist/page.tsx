'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import ClientShell from '@/components/client/ClientShell';
import ShortlistView from '@/components/client/ShortlistView';
import { getApprovedCreators } from '@/lib/data/creators';
import { ROUTES } from '@/lib/routes';

export default function ClientShortlistPage() {
  return (
    <RequireAuth role="client" loginHref={ROUTES.client.login}>
      <ClientShell pageTitle="Shortlist" pageSub="Creators you've saved across sessions.">
        <ShortlistView creators={getApprovedCreators()} />
      </ClientShell>
    </RequireAuth>
  );
}
