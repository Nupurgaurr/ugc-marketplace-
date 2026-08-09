import PublicLanding from '@/components/PublicLanding';
import { getApprovedCreators } from '@/lib/api';

export const metadata = {
  title: 'UGC Creator Marketplace — Blackcoffee Media',
  description:
    'A curated UGC creator network operated by Blackcoffee Media. Brands find vetted creators; creators apply to join.',
};

export default async function Page() {
  const creators = await getApprovedCreators();
  return <PublicLanding creators={creators} />;
}
