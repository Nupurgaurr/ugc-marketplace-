'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import CreatorShell from '@/components/creator/CreatorShell';
import RequestInbox from '@/components/creator/RequestInbox';
import { ROUTES } from '@/lib/routes';

export default function CreatorRequestsPage() {
  return (
    <RequireAuth role="creator" loginHref={ROUTES.creator.login}>
      <CreatorShell pageTitle="Requests" pageSub="Brands who want to work with you.">
        <RequestInbox />
      </CreatorShell>
    </RequireAuth>
  );
}
