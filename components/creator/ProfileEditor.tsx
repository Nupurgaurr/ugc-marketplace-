'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { saveProfile } from '@/app/actions/profile';
import type { CreatorProfile } from '@/lib/schemas/creator';
import styles from './creator.module.css';

/** Task 2 makes bio and availability real. Category, content styles,
 *  languages, social profiles and sample links become editable in Task 6;
 *  until then they pass through untouched so the shared schema still
 *  validates the whole profile. */
const editableSchema = z.object({
  bio: z.string().trim().max(600, 'Thoda chhota karo, 600 characters tak.'),
  availability: z.string().trim().max(120),
});

type Editable = z.infer<typeof editableSchema>;

export default function ProfileEditor({ profile }: { profile: CreatorProfile }) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Editable>({
    resolver: zodResolver(editableSchema),
    defaultValues: { bio: profile.bio, availability: profile.availability },
  });

  const onSubmit = (values: Editable) => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveProfile({ ...profile, ...values });
      setMessage({ ok: result.ok, text: result.message });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.profileForm}>
      <label className={styles.textareaField}>
        <span className={styles.textareaLabel}>Bio</span>
        <textarea rows={3} className={styles.textarea} {...register('bio')} />
        {errors.bio && <span className={styles.fieldError}>{errors.bio.message}</span>}
      </label>

      <FormField label="Availability" error={errors.availability?.message} {...register('availability')} />

      {message && (
        <p className={message.ok ? styles.authNoteOk : styles.authNoteError}>{message.text}</p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? 'Saving' : 'Save changes'}
      </Button>
    </form>
  );
}
