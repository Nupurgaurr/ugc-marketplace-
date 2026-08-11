'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { loginCreator } from '@/lib/auth/mockAuth';
import { ROUTES } from '@/lib/routes';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginCreator(email);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(ROUTES.creator.dashboard);
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: '1.2rem', maxWidth: '420px', marginInline: 'auto' }}>
      <FormField label="Email" type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {error && <p style={{ color: 'var(--status-danger)', fontSize: 'var(--step--1)' }}>{error}</p>}
      <Button type="submit" variant="primary" block arrow>
        Log in
      </Button>
      <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash-dim)', textAlign: 'center' }}>
        Prototype — try aisha.rahman@example.com (a seeded mock creator), or apply as a new creator.
      </p>
    </form>
  );
}
