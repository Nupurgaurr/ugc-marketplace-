'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import CreatorShell from '@/components/creator/CreatorShell';
import BriefsView from '@/components/creator/BriefsView';
import { ROUTES } from '@/lib/routes';

export default function CreatorBriefsPage() {
  return (
    <RequireAuth role="creator" loginHref={ROUTES.creator.login}>
      <CreatorShell pageTitle="Briefs" pageSub="Paid briefs from real brands. We chase the invoice, not you.">
        <BriefsView />
      </CreatorShell>
    </RequireAuth>
  );
}
