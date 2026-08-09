import ClientExperience from '@/components/ClientExperience';
import { getApprovedCreators } from '@/lib/api';

export const metadata = {
  title: 'Find a UGC creator — Blackcoffee Media',
  description:
    'Watch real portfolio work, filter by category, language, city and rate, and shortlist without an account.',
};

export default async function FindACreatorPage() {
  const creators = await getApprovedCreators();
  return <ClientExperience creators={creators} />;
}
