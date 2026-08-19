import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import CreatorQueue from '@/components/admin/CreatorQueue';
import { createClient } from '@/lib/supabase/server';
import { getCreatorQueue, isCurrentUserAdmin } from '@/lib/data/admin';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Creator approvals — blackcoffee. UGC' };

export default async function AdminCreatorsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(ROUTES.admin.login);
  if (!(await isCurrentUserAdmin())) redirect(ROUTES.home);

  const rows = await getCreatorQueue();

  return (
    <AdminShell
      pageTitle="Creator approvals"
      pageSub="Approve and reject every creator on the roster."
      sessionEmail={user.email ?? ''}
    >
      <CreatorQueue rows={rows} />
    </AdminShell>
  );
}
