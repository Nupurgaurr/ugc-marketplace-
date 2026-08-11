import Link from 'next/link';
import AuthPageShell from '@/components/shared/AuthPageShell';
import RegisterWizard from '@/components/creator/RegisterWizard';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Become a UGC creator — blackcoffee. UGC' };

export default function CreatorRegisterPage() {
  return (
    <AuthPageShell
      eyebrow="For creators"
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
