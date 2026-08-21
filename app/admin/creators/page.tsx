import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import CreatorQueue from '@/components/admin/CreatorQueue';
import { getAdminSession } from '@/lib/admin/guard';
import { getCreatorQueue } from '@/lib/data/admin';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Creator approvals · blackcoffee. UGC' };

export default async function AdminCreatorsPage() {
  const session = await getAdminSession();
  if (!session) redirect(ROUTES.admin.login);

  const rows = await getCreatorQueue();

  return (
    <AdminShell
      pageTitle="Creator approvals"
      pageSub="Approve and reject every creator on the roster."
      sessionEmail={session.email}
    >
      <CreatorQueue rows={rows} />
    </AdminShell>
  );
}
