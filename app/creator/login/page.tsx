import Link from 'next/link';
import AuthPageShell from '@/components/shared/AuthPageShell';
import LoginForm from '@/components/creator/LoginForm';
import { ROUTES } from '@/lib/routes';

export const metadata = { title: 'Creator login — blackcoffee. UGC' };

export default function CreatorLoginPage() {
  return (
    <AuthPageShell
      eyebrow="For creators"
      title="Welcome back"
      footer={
        <>
          Not a partner yet? <Link href={ROUTES.creator.register}>Apply here</Link>
        </>
      }
    >
      <LoginForm />
    </AuthPageShell>
  );
}
