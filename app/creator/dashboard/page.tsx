'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import CreatorShell from '@/components/creator/CreatorShell';
import DashboardOverview from '@/components/creator/DashboardOverview';
import { ROUTES } from '@/lib/routes';

export default function CreatorDashboardPage() {
  return (
    <RequireAuth role="creator" loginHref={ROUTES.creator.login}>
      <CreatorShell pageTitle="Overview" pageSub="Your application status and activity.">
        <DashboardOverview />
      </CreatorShell>
    </RequireAuth>
  );
}
