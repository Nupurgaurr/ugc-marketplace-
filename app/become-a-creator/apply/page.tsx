import Link from 'next/link';
import AuthPageShell from '@/components/shared/AuthPageShell';
import RegisterWizard from '@/components/creator/RegisterWizard';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Lights, camera, apply. — blackcoffee. UGC' };

export default function CreatorApplyPage() {
  return (
    <AuthPageShell
      title="Lights, camera, apply."
      footer={
        <>
          Already applied? <Link href={ROUTES.creator.login}>Log in</Link>
        </>
      }
    >
      <RegisterWizard />
    </AuthPageShell>
  );
}
