'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import CreatorShell from '@/components/creator/CreatorShell';
import ProfileEditor from '@/components/creator/ProfileEditor';
import { ROUTES } from '@/lib/routes';

export default function CreatorProfilePage() {
  return (
    <RequireAuth role="creator" loginHref={ROUTES.creator.login}>
      <CreatorShell pageTitle="Profile & portfolio" pageSub="What brands see once you're approved.">
        <ProfileEditor />
      </CreatorShell>
    </RequireAuth>
  );
}
