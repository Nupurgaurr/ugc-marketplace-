'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { loginAdmin } from '@/lib/auth/mockAuth';
import { ROUTES } from '@/lib/routes';

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginAdmin(username, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(ROUTES.admin.dashboard);
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: '1.2rem', maxWidth: '380px', marginInline: 'auto' }}>
      <FormField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <FormField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p style={{ color: 'var(--status-danger)', fontSize: 'var(--step--1)' }}>{error}</p>}
      <Button type="submit" variant="primary" block arrow>
        Enter
      </Button>
      <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash-dim)', textAlign: 'center' }}>
        Internal use only. Dev credentials: admin / blackcoffee2026.
      </p>
    </form>
  );
}
