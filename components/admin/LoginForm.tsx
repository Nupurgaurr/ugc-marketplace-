'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Lock } from 'lucide-react';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { adminSignIn } from '@/app/actions/admin-auth';
import type { ActionResult } from '@/app/actions/auth';
import styles from './admin.module.css';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" block arrow disabled={pending}>
      {pending ? 'Signing in' : 'Sign in'}
    </Button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(adminSignIn, null);

  return (
    <form action={formAction} className={styles.authForm}>
      <FormField label="Email" name="email" type="email" placeholder="you@blackcoffee.media" required />
      <FormField label="Password" name="password" type="password" required />

      {state && <p className={state.ok ? styles.authNoteOk : styles.authNoteError}>{state.message}</p>}

      <SubmitButton />

      <p className={styles.authHint}>
        <Lock size={14} aria-hidden="true" />
        Internal use. Restricted to two authorized addresses.
      </p>
    </form>
  );
}
