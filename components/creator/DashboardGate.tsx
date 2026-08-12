'use client';

import PendingStage from '@/components/shared/PendingStage';
import CreatorShell from './CreatorShell';
import DashboardOverview from './DashboardOverview';
import { useAuth } from '@/lib/auth/useAuth';
import { getCreatorById } from '@/lib/data/creators';

/** Pending/in-review applications get the full-black waiting stage. Approved
 *  and rejected both fall through to the real dashboard — rejected gets
 *  plain, respectful copy there (see StatusTracker), never this stage. */
export default function DashboardGate() {
  const { session } = useAuth('creator');
  const creator = session ? getCreatorById(session.id) : undefined;

  if (creator && (creator.status === 'applied' || creator.status === 'in_review')) {
    return <PendingStage role="creator" submittedAt={creator.submittedAt} />;
  }

  return (
    <CreatorShell pageTitle="Overview" pageSub="Your application status and activity.">
      <DashboardOverview />
    </CreatorShell>
  );
}
