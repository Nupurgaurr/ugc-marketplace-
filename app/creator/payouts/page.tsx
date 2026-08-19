import { redirect } from 'next/navigation';
import CreatorShell from '@/components/creator/CreatorShell';
import PayoutDetailsForm from '@/components/creator/PayoutDetailsForm';
import { getCurrentCreator, getMaskedPayoutDetails } from '@/lib/data/creator';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Payout details · blackcoffee. UGC' };

export default async function CreatorPayoutsPage() {
  const creator = await getCurrentCreator();
  if (!creator) redirect(ROUTES.creator.login);
  if (creator.status !== 'approved') redirect(ROUTES.creator.dashboard);

  const saved = await getMaskedPayoutDetails(creator.id);

  return (
    <CreatorShell
      pageTitle="Payout details"
      pageSub="How BCM pays you."
      sessionName={creator.full_name}
      sessionEmail={creator.email}
    >
      <PayoutDetailsForm saved={saved} />
    </CreatorShell>
  );
}
