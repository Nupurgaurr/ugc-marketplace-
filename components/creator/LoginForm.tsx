'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Mail } from 'lucide-react';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { sendMagicLink, type ActionResult } from '@/app/actions/auth';
import styles from './creator.module.css';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" block arrow disabled={pending}>
      {pending ? 'Bhej rahe hain' : 'Send me a link'}
    </Button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useFormState<ActionResult | null, FormData>(sendMagicLink, null);

  return (
    <form action={formAction} className={styles.authForm}>
      <FormField label="Email" name="email" type="email" placeholder="you@email.com" required />

      {state && (
        <p className={state.ok ? styles.authNoteOk : styles.authNoteError}>{state.message}</p>
      )}

      <SubmitButton />

      <p className={styles.authHint}>
        <Mail size={14} aria-hidden="true" />
        No password. We email you a link that signs you in.
      </p>
    </form>
  );
}
