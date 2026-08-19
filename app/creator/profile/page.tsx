import { redirect } from 'next/navigation';
import CreatorShell from '@/components/creator/CreatorShell';
import ProfileEditor from '@/components/creator/ProfileEditor';
import { getCurrentCreator, getSampleLinks, getSocialProfiles } from '@/lib/data/creator';
import { ROUTES } from '@/lib/routes';
import type { CreatorProfileInput } from '@/lib/schemas/creator';

export const metadata = { title: 'Profile · blackcoffee. UGC' };

export default async function CreatorProfilePage() {
  const creator = await getCurrentCreator();
  if (!creator) redirect(ROUTES.creator.login);
  if (creator.status !== 'approved') redirect(ROUTES.creator.dashboard);

  const [socialProfiles, sampleLinks] = await Promise.all([
    getSocialProfiles(creator.id),
    getSampleLinks(creator.id),
  ]);

  const profile: CreatorProfileInput = {
    bio: creator.bio,
    availability: creator.availability,
    categoryId: creator.category_id ?? '',
    contentStyles: creator.content_styles,
    languages: creator.languages,
    socialProfiles: socialProfiles.map((p) => ({
      platform: p.platform,
      handle: p.handle,
      followerCount: p.follower_count,
    })),
    sampleLinks: sampleLinks.map((l) => l.url),
  };

  return (
    <CreatorShell
      pageTitle="Profile"
      pageSub="What BCM sees when matching you to work."
      sessionName={creator.full_name}
      sessionEmail={creator.email}
    >
      <ProfileEditor profile={profile} />
    </CreatorShell>
  );
}
