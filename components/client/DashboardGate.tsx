'use client';

import PendingStage from '@/components/shared/PendingStage';
import ClientShell from './ClientShell';
import DashboardOverview from './DashboardOverview';
import { useAuth } from '@/lib/auth/useAuth';
import { getClientById } from '@/lib/data/clients';

/** Pending accounts get the full-black waiting stage, not a fake dashboard
 *  behind a sidebar. See components/shared/PendingStage.tsx. */
export default function DashboardGate() {
  const { session } = useAuth('client');
  const account = session ? getClientById(session.id) : undefined;

  if (account && account.status === 'pending') {
    return <PendingStage role="client" submittedAt={account.submittedAt} />;
  }

  return (
    <ClientShell pageTitle="Overview" pageSub="Everything about your brand's activity on the marketplace.">
      <DashboardOverview />
    </ClientShell>
  );
}
