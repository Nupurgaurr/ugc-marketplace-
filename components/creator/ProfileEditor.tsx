'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { OptionTileGroup, type Option } from '@/components/shared/OptionTile';
import SocialProfilesField from './SocialProfilesField';
import SampleLinksField from './SampleLinksField';
import { saveProfile } from '@/app/actions/profile';
import {
  creatorProfileSchema,
  type CreatorProfile,
  type CreatorProfileInput,
} from '@/lib/schemas/creator';
import { LANGUAGES } from '@/lib/languages';
import type { Category, ContentStyle } from '@/lib/types';
import styles from './creator.module.css';

const LANGUAGE_OPTIONS: Option[] = LANGUAGES.map((l) => ({
  value: l.value,
  label: l.label,
  script: l.value !== 'english',
  rtl: l.rtl,
}));

export default function ProfileEditor({
  profile,
  categories,
  contentStyles,
}: {
  profile: CreatorProfileInput;
  categories: Category[];
  contentStyles: ContentStyle[];
}) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatorProfileInput, unknown, CreatorProfile>({
    resolver: zodResolver(creatorProfileSchema),
    mode: 'onTouched',
    defaultValues: profile,
  });

  const onSubmit = (values: CreatorProfile) => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveProfile(values);
      setMessage({ ok: result.ok, text: result.message });
    });
  };

  const categoryOptions: Option[] = categories.map((c) => ({ value: c.id, label: c.label }));
  const styleOptions: Option[] = contentStyles.map((s) => ({ value: s.slug, label: s.label }));

  const socialErrors = Array.isArray(errors.socialProfiles)
    ? Object.fromEntries(errors.socialProfiles.map((e, i) => [i, e?.handle?.message]))
    : undefined;
  const sampleErrors = Array.isArray(errors.sampleLinks)
    ? Object.fromEntries(errors.sampleLinks.map((e, i) => [i, e?.message]))
    : undefined;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.profileForm} noValidate>
      <label className={styles.textareaField}>
        <span className={styles.textareaLabel}>Bio</span>
        <textarea rows={3} className={styles.textarea} {...register('bio')} />
        {errors.bio && <span className={styles.fieldError}>{errors.bio.message}</span>}
      </label>

      <FormField label="Availability" error={errors.availability?.message} {...register('availability')} />

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Your main category</legend>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <OptionTileGroup
              label="Your main category"
              options={categoryOptions}
              value={field.value}
              multiple={false}
              onChange={field.onChange}
            />
          )}
        />
        {errors.categoryId && <p className={styles.fieldError}>{errors.categoryId.message}</p>}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Content styles you shoot</legend>
        <Controller
          control={control}
          name="contentStyles"
          render={({ field }) => (
            <OptionTileGroup
              label="Content styles you shoot"
              options={styleOptions}
              value={field.value}
              multiple
              onChange={field.onChange}
            />
          )}
        />
        {errors.contentStyles && <p className={styles.fieldError}>{errors.contentStyles.message}</p>}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Languages you shoot in</legend>
        <Controller
          control={control}
          name="languages"
          render={({ field }) => (
            <OptionTileGroup
              label="Languages you shoot in"
              options={LANGUAGE_OPTIONS}
              value={field.value}
              multiple
              onChange={field.onChange}
            />
          )}
        />
        {errors.languages && <p className={styles.fieldError}>{errors.languages.message}</p>}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Where people can find you</legend>
        <Controller
          control={control}
          name="socialProfiles"
          render={({ field }) => (
            <SocialProfilesField value={field.value} onChange={field.onChange} errors={socialErrors} />
          )}
        />
        {typeof errors.socialProfiles?.message === 'string' && (
          <p className={styles.fieldError}>{errors.socialProfiles.message}</p>
        )}
      </fieldset>

      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>Sample links</legend>
        <p className={styles.groupHint}>Optional, up to three.</p>
        <Controller
          control={control}
          name="sampleLinks"
          render={({ field }) => (
            <SampleLinksField value={field.value ?? []} onChange={field.onChange} errors={sampleErrors} />
          )}
        />
      </fieldset>

      {message && <p className={message.ok ? styles.authNoteOk : styles.authNoteError}>{message.text}</p>}

      <div>
        <Button type="submit" variant="primary" disabled={isPending}>
          {isPending ? 'Saving' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}
