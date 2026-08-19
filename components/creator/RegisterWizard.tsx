'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import Button from '@/components/shared/Button';
import FormField from '@/components/shared/FormField';
import { OptionTileGroup, type Option } from '@/components/shared/OptionTile';
import MemeBeat, { type Beat } from './MemeBeat';
import SocialProfilesField from './SocialProfilesField';
import SampleLinksField from './SampleLinksField';
import { submitApplication } from '@/app/actions/application';
import {
  creatorApplicationSchema,
  type CreatorApplication,
  type CreatorApplicationInput,
} from '@/lib/schemas/creator';
import { RATE_BAND_OPTIONS, SHOOT_SETUP_OPTIONS, TURNAROUND_OPTIONS } from '@/lib/options';
import { LANGUAGES } from '@/lib/languages';
import { ROUTES } from '@/lib/routes';
import { cx } from '@/lib/utils';
import type { Category, ContentStyle } from '@/lib/types';
import styles from './RegisterWizard.module.css';

const STEPS: Array<{ label: string; beat: Beat; variant: 'card' | 'line' }> = [
  {
    label: 'Naam & thikana',
    beat: {
      line: 'Har entry mein thoda drama hona chahiye.',
      caption: 'Scene 1: you, but main-character energy.',
    },
    variant: 'card',
  },
  {
    label: 'Genre',
    beat: { line: 'Apna genre, apna swag. No copy-paste allowed.' },
    variant: 'line',
  },
  {
    label: 'Zubaan',
    beat: { line: 'Jitni zubaan, utna reach.' },
    variant: 'line',
  },
  {
    label: 'Setup & speed',
    beat: { line: 'Setup chhota ho ya bada, speed hi hero hai.' },
    variant: 'line',
  },
  {
    label: 'Dikhao kaam',
    beat: {
      line: 'Ab dikhao asli talent. Links bhejo, drama nahi.',
      caption: 'This is the item number of your application.',
    },
    variant: 'card',
  },
];

/** Which fields each step is allowed to complain about. */
const STEP_FIELDS: Array<FieldPath<CreatorApplicationInput>[]> = [
  ['fullName', 'city', 'phone', 'email'],
  ['categoryId', 'contentStyles'],
  ['languages'],
  ['shootSetup', 'turnaround', 'rateBand'],
  ['socialProfiles', 'sampleLinks'],
];

const LANGUAGE_OPTIONS: Option[] = LANGUAGES.map((l) => ({
  value: l.value,
  label: l.label,
  script: l.value !== 'english',
  rtl: l.rtl,
}));

export default function RegisterWizard({
  categories,
  contentStyles,
}: {
  categories: Category[];
  contentStyles: ContentStyle[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState('');
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<CreatorApplicationInput, unknown, CreatorApplication>({
    resolver: zodResolver(creatorApplicationSchema),
    // Validate when a field is left, then keep it live so an error clears the
    // moment it is fixed rather than staying red until the next submit.
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      city: '',
      phone: '',
      email: '',
      categoryId: '',
      contentStyles: [],
      languages: [],
      shootSetup: undefined,
      turnaround: undefined,
      rateBand: undefined,
      socialProfiles: [{ platform: 'instagram', handle: '', followerCount: null }],
      sampleLinks: [],
    },
  });

  const isLast = step === STEPS.length - 1;

  const goNext = async () => {
    setSubmitError('');
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) return;
    setStep((s) => s + 1);
  };

  const onSubmit = (application: CreatorApplication) => {
    setSubmitError('');
    startTransition(async () => {
      const result = await submitApplication(application);
      if (!result.ok) {
        setSubmitError(result.message);
        return;
      }
      router.push(ROUTES.creator.dashboard);
    });
  };

  const categoryOptions: Option[] = categories.map((c) => ({ value: c.id, label: c.label }));
  const styleOptions: Option[] = contentStyles.map((s) => ({ value: s.slug, label: s.label }));

  const socialErrors = Array.isArray(errors.socialProfiles)
    ? Object.fromEntries(
        errors.socialProfiles.map((entry, i) => [i, entry?.handle?.message ?? entry?.followerCount?.message])
      )
    : undefined;

  const sampleErrors = Array.isArray(errors.sampleLinks)
    ? Object.fromEntries(errors.sampleLinks.map((entry, i) => [i, entry?.message]))
    : undefined;

  return (
    <form className={styles.layout} onSubmit={handleSubmit(onSubmit)} noValidate>
      <aside className={styles.rail}>
        <ol className={styles.steps}>
          {STEPS.map((s, i) => (
            <li
              key={s.label}
              className={cx(
                styles.step,
                i < step && styles.stepDone,
                i === step && styles.stepNow
              )}
              aria-current={i === step ? 'step' : undefined}
            >
              <span className={styles.stepIndex}>
                {i < step ? <Check size={13} aria-hidden="true" /> : i + 1}
              </span>
              <span className={styles.stepLabel}>{s.label}</span>
            </li>
          ))}
        </ol>

        <div className={styles.beat}>
          <MemeBeat {...STEPS[step].beat} variant={STEPS[step].variant} />
        </div>
      </aside>

      <div className={styles.panel}>
        <div className={styles.fields}>
          {step === 0 && (
            <>
              <FormField label="Full name" placeholder="Your name" error={errors.fullName?.message} {...register('fullName')} />
              <FormField label="City" placeholder="e.g. Mumbai" error={errors.city?.message} {...register('city')} />
              <FormField label="Phone / WhatsApp" type="tel" placeholder="+91" error={errors.phone?.message} {...register('phone')} />
              <FormField label="Email" type="email" placeholder="you@email.com" error={errors.email?.message} {...register('email')} />
            </>
          )}

          {step === 1 && (
            <>
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
                {errors.categoryId && <p className={styles.error}>{errors.categoryId.message}</p>}
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
                {errors.contentStyles && <p className={styles.error}>{errors.contentStyles.message}</p>}
              </fieldset>
            </>
          )}

          {step === 2 && (
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
              {errors.languages && <p className={styles.error}>{errors.languages.message}</p>}
            </fieldset>
          )}

          {step === 3 && (
            <>
              <fieldset className={styles.group}>
                <legend className={styles.groupLabel}>What do you shoot on</legend>
                <Controller
                  control={control}
                  name="shootSetup"
                  render={({ field }) => (
                    <OptionTileGroup
                      label="What do you shoot on"
                      options={SHOOT_SETUP_OPTIONS.map((o) => ({ ...o }))}
                      value={field.value ?? ''}
                      multiple={false}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.shootSetup && <p className={styles.error}>{errors.shootSetup.message}</p>}
              </fieldset>

              <fieldset className={styles.group}>
                <legend className={styles.groupLabel}>Usual turnaround</legend>
                <Controller
                  control={control}
                  name="turnaround"
                  render={({ field }) => (
                    <OptionTileGroup
                      label="Usual turnaround"
                      options={TURNAROUND_OPTIONS.map((o) => ({ ...o }))}
                      value={field.value ?? ''}
                      multiple={false}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.turnaround && <p className={styles.error}>{errors.turnaround.message}</p>}
              </fieldset>

              <fieldset className={styles.group}>
                <legend className={styles.groupLabel}>Rate per video</legend>
                <Controller
                  control={control}
                  name="rateBand"
                  render={({ field }) => (
                    <OptionTileGroup
                      label="Rate per video"
                      options={RATE_BAND_OPTIONS.map((o) => ({ ...o }))}
                      value={field.value ?? ''}
                      multiple={false}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.rateBand && <p className={styles.error}>{errors.rateBand.message}</p>}
              </fieldset>
            </>
          )}

          {step === 4 && (
            <>
              <fieldset className={styles.group}>
                <legend className={styles.groupLabel}>Where people can find you</legend>
                <Controller
                  control={control}
                  name="socialProfiles"
                  render={({ field }) => (
                    <SocialProfilesField
                      value={field.value}
                      onChange={field.onChange}
                      errors={socialErrors}
                    />
                  )}
                />
                {typeof errors.socialProfiles?.message === 'string' && (
                  <p className={styles.error}>{errors.socialProfiles.message}</p>
                )}
              </fieldset>

              <fieldset className={styles.group}>
                <legend className={styles.groupLabel}>Sample links</legend>
                <p className={styles.groupHint}>Optional, up to three. Instagram reels are perfect.</p>
                <Controller
                  control={control}
                  name="sampleLinks"
                  render={({ field }) => (
                    <SampleLinksField
                      value={field.value ?? []}
                      onChange={field.onChange}
                      errors={sampleErrors}
                    />
                  )}
                />
              </fieldset>

              <ReviewSummary values={getValues()} categories={categories} />
            </>
          )}

          {submitError && <p className={styles.error}>{submitError}</p>}
        </div>

        <div className={styles.footer}>
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>

          {isLast ? (
            <Button type="submit" variant="primary" disabled={isPending}>
              {isPending ? 'Bhej rahe hain' : 'Submit'}
            </Button>
          ) : (
            <Button variant="primary" arrow onClick={goNext}>
              Aage badho
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

function ReviewSummary({
  values,
  categories,
}: {
  values: CreatorApplicationInput;
  categories: Category[];
}) {
  const category = categories.find((c) => c.id === values.categoryId)?.label ?? '';
  const languages = values.languages
    .map((v) => LANGUAGES.find((l) => l.value === v)?.label ?? v)
    .join(', ');

  return (
    <div className={styles.review}>
      <p className={styles.reviewTitle}>Interval ho gaya. Last look before submit.</p>
      <p>
        <strong>{values.fullName}</strong> · {values.city}
      </p>
      <p>
        {values.phone} · {values.email}
      </p>
      <p>
        {category} · {values.contentStyles.join(', ')}
      </p>
      <p className={styles.reviewScript}>{languages}</p>
      <p className={styles.reviewNote}>
        A real person reviews this, usually within 48 hours. Track your status from the dashboard.
      </p>
    </div>
  );
}
