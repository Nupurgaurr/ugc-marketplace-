import Link from 'next/link';
import AuthPageShell from '@/components/shared/AuthPageShell';
import LoginForm from '@/components/client/LoginForm';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Brand login — blackcoffee. UGC' };

export default function ClientLoginPage() {
  return (
    <AuthPageShell
      title="Welcome back, brand."
      footer={
        <>
          New here? <Link href={ROUTES.client.register}>Register your brand</Link>
        </>
      }
    >
      <LoginForm />
    </AuthPageShell>
  );
}
