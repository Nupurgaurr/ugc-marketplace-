import Link from 'next/link';
import AuthPageShell from '@/components/shared/AuthPageShell';
import RegisterWizard from '@/components/client/RegisterWizard';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Register your brand — blackcoffee. UGC' };

export default function ClientRegisterPage() {
  return (
    <AuthPageShell
      title="Register your brand"
      footer={
        <>
          Already have an account? <Link href={ROUTES.client.login}>Log in</Link>
        </>
      }
    >
      <RegisterWizard />
    </AuthPageShell>
  );
}
