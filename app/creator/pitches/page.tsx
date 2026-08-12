'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import CreatorShell from '@/components/creator/CreatorShell';
import PitchesView from '@/components/creator/PitchesView';
import { ROUTES } from '@/lib/routes';

export default function CreatorPitchesPage() {
  return (
    <RequireAuth role="creator" loginHref={ROUTES.creator.login}>
      <CreatorShell pageTitle="My pitches" pageSub="Every brief you've pitched on, and where it stands.">
        <PitchesView />
      </CreatorShell>
    </RequireAuth>
  );
}
