'use client';

import { useParams } from 'next/navigation';
import RequireAuth from '@/components/shared/RequireAuth';
import ClientShell from '@/components/client/ClientShell';
import PitchReviewView from '@/components/client/PitchReviewView';
import { ROUTES } from '@/lib/routes';

export default function ClientBriefPitchesPage() {
  const params = useParams<{ id: string }>();

  return (
    <RequireAuth role="client" loginHref={ROUTES.client.login}>
      <ClientShell pageTitle="Pitches" pageSub="Shortlist, select, or pass on who pitched.">
        <PitchReviewView briefId={params.id} />
      </ClientShell>
    </RequireAuth>
  );
}
