'use client';

import RequireAuth from '@/components/shared/RequireAuth';
import ClientShell from '@/components/client/ClientShell';
import BriefForm from '@/components/client/BriefForm';
import { ROUTES } from '@/lib/routes';

export default function ClientBriefPage() {
  return (
    <RequireAuth role="client" loginHref={ROUTES.client.login}>
      <ClientShell pageTitle="Post a brief" pageSub="Describe what you need — admin suggests matching creators.">
        <BriefForm />
      </ClientShell>
    </RequireAuth>
  );
}
