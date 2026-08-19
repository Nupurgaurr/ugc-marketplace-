import { redirect } from 'next/navigation';
import PendingStage from '@/components/shared/PendingStage';
import CreatorShell from '@/components/creator/CreatorShell';
import StatusTracker from '@/components/creator/StatusTracker';
import { getCurrentCreator } from '@/lib/data/creator';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Overview · blackcoffee. UGC' };

/** Applied and in-review applications get the waiting stage instead of a
 *  dashboard. Approved and rejected both fall through to the real one;
 *  rejected reads as a plain message there, never a roast. */
export default async function CreatorDashboardPage() {
  const creator = await getCurrentCreator();

  if (!creator) redirect(ROUTES.creator.login);

  if (creator.status === 'applied' || creator.status === 'in_review') {
    return <PendingStage submittedAt={creator.created_at} />;
  }

  return (
    <CreatorShell pageTitle="Overview" pageSub="Your application status.">
      <StatusTracker status={creator.status} />
    </CreatorShell>
  );
}
