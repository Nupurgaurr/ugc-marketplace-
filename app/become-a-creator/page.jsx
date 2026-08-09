import CreatorLanding from '@/components/CreatorLanding';
import { getApprovedCreators } from '@/lib/api';
import { featuredProfile, sampleRequests } from '@/lib/creators';

export const metadata = {
  title: 'Become a UGC partner — Blackcoffee Media',
  description:
    "Apply to join Blackcoffee Media's vetted UGC creator network. Free to apply, reviewed by a person, and your portfolio is what brands browse.",
};

export default async function BecomeACreatorPage() {
  const creators = await getApprovedCreators();
  return (
    <CreatorLanding
      creators={creators}
      profile={featuredProfile}
      requests={sampleRequests}
    />
  );
}
