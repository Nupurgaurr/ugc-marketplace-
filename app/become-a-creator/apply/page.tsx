import Link from 'next/link';
import AuthPageShell from '@/components/shared/AuthPageShell';
import RegisterWizard from '@/components/creator/RegisterWizard';
import { getCategories, getContentStyles } from '@/lib/data/options';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Lights, camera, apply. · blackcoffee. UGC' };

export default async function CreatorApplyPage() {
  const [categories, contentStyles] = await Promise.all([getCategories(), getContentStyles()]);

  return (
    <AuthPageShell
      title="Lights, camera, apply."
      footer={
        <>
          Already applied? <Link href={ROUTES.creator.login}>Log in</Link>
        </>
      }
    >
      <RegisterWizard categories={categories} contentStyles={contentStyles} />
    </AuthPageShell>
  );
}
