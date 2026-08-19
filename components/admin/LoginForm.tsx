'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Mail } from 'lucide-react';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { sendMagicLink, type ActionResult } from '@/app/actions/auth';
import styles from './admin.module.css';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" block arrow disabled={pending}>
      {pending ? 'Sending' : 'Send me a link'}
    </Button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(sendMagicLink, null);

  return (
    <form action={formAction} className={styles.authForm}>
      <input type="hidden" name="portal" value="admin" />
      <FormField label="Email" name="email" type="email" placeholder="you@blackcoffee.media" required />

      {state && <p className={state.ok ? styles.authNoteOk : styles.authNoteError}>{state.message}</p>}

      <SubmitButton />

      <p className={styles.authHint}>
        <Mail size={14} aria-hidden="true" />
        Internal use. Only addresses in the admins table can sign in.
      </p>
    </form>
  );
}
