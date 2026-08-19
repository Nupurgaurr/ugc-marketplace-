'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/shared/WizardShell';
import FormField, { formFieldStyles } from '@/components/shared/FormField';
import { Chip } from '@/components/shared/Tag';
import MemeBeat from './MemeBeat';
import { submitApplication } from '@/app/actions/application';
import { creatorApplicationSchema, type CreatorApplication } from '@/lib/schemas/creator';
import { RATE_BAND_OPTIONS, SHOOT_SETUP_OPTIONS, TURNAROUND_OPTIONS } from '@/lib/options';
import { LANGUAGES } from '@/lib/languages';
import { ROUTES } from '@/lib/routes';
import type { Category, ContentStyle } from '@/lib/types';
import styles from './creator.module.css';

const STEP_LABELS = ['Naam & thikana', 'Genre', 'Zubaan', 'Setup & speed', 'Dikhao kaam'];

const MEME_BEATS = [
  { line: 'Har entry mein thoda drama hona chahiye.', caption: 'Scene 1: you, but main-character energy.' },
  { line: 'Apna genre, apna swag, no copy-paste allowed.', caption: 'Pick your lane like it is the opening credits.' },
  { line: 'Jitni zubaan, utna reach.', caption: 'Dialogue delivery matters. So does language reach.' },
  { line: 'Setup chhota ho ya bada, speed hi hero hai.', caption: 'Brands forgive a lot. Late delivery is not one of them.' },
  { line: 'Ab dikhao asli talent, links bhejo, drama nahi.', caption: 'This is the item number of your application.' },
];

const EMPTY: CreatorApplication = {
  fullName: '',
  city: '',
  phone: '',
  email: '',
  categoryId: '',
  contentStyles: [],
  languages: [],
  shootSetup: 'phone',
  turnaround: '48h',
  rateBand: 'under_10k',
  socialProfiles: [{ platform: 'instagram', handle: '' }],
  sampleLinks: [],
};

const STEP_FIELDS: Array<Array<keyof CreatorApplication>> = [
  ['fullName', 'city', 'phone', 'email'],
  ['categoryId', 'contentStyles'],
  ['languages'],
  ['shootSetup', 'turnaround', 'rateBand'],
  ['socialProfiles', 'sampleLinks'],
];

export default function RegisterWizard({
  categories,
  contentStyles,
}: {
  categories: Category[];
  contentStyles: ContentStyle[];
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreatorApplication>(EMPTY);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const set = <K extends keyof CreatorApplication>(key: K, value: CreatorApplication[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleMulti = (key: 'contentStyles' | 'languages', value: string) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  /** Validate only the fields this step owns, using the same schema the
   *  route handler runs. */
  const validateStep = (): string => {
    const result = creatorApplicationSchema.safeParse(form);
    if (result.success) return '';
    const owned = STEP_FIELDS[step];
    const issue = result.error.issues.find((i) => owned.includes(i.path[0] as keyof CreatorApplication));
    return issue?.message ?? '';
  };

  const handleNext = () => {
    const stepError = validateStep();
    if (stepError) {
      setError(stepError);
      return;
    }
    setError('');

    if (step < STEP_LABELS.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    startTransition(async () => {
      const result = await submitApplication(form);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      router.push(ROUTES.creator.dashboard);
    });
  };

  const categoryLabel = categories.find((c) => c.id === form.categoryId)?.label ?? '';
  const instagram = form.socialProfiles[0];

  return (
    <WizardShell
      stepLabels={STEP_LABELS}
      activeIndex={step}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      isLast={step === STEP_LABELS.length - 1}
      nextLabel="Aage badho"
      submitting={isPending}
    >
      <MemeBeat {...MEME_BEATS[step]} />

      {error && <p className={styles.wizardError}>{error}</p>}

      {step === 0 && (
        <div className={styles.wizardFields}>
          <FormField label="Full name" placeholder="Your name" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} />
          <FormField label="City" placeholder="e.g. Mumbai" value={form.city} onChange={(e) => set('city', e.target.value)} />
          <FormField label="Phone / WhatsApp" type="tel" placeholder="+91" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <FormField label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
      )}

      {step === 1 && (
        <div className={styles.wizardGroups}>
          <div>
            <p className={styles.wizardLabel}>Your main category</p>
            <div className={formFieldStyles.chips}>
              {categories.map((c) => (
                <Chip key={c.id} active={form.categoryId === c.id} onClick={() => set('categoryId', c.id)}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className={styles.wizardLabel}>Content styles you shoot</p>
            <div className={formFieldStyles.chips}>
              {contentStyles.map((s) => (
                <Chip key={s.id} active={form.contentStyles.includes(s.slug)} onClick={() => toggleMulti('contentStyles', s.slug)}>
                  {s.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className={styles.wizardLabel}>Languages you shoot in</p>
          <div className={formFieldStyles.chips}>
            {LANGUAGES.map((l) => (
              <Chip key={l.value} active={form.languages.includes(l.value)} onClick={() => toggleMulti('languages', l.value)}>
                {l.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.wizardGroups}>
          <div>
            <p className={styles.wizardLabel}>What do you shoot on</p>
            <div className={formFieldStyles.chips}>
              {SHOOT_SETUP_OPTIONS.map((o) => (
                <Chip key={o.value} active={form.shootSetup === o.value} onClick={() => set('shootSetup', o.value)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className={styles.wizardLabel}>Usual turnaround</p>
            <div className={formFieldStyles.chips}>
              {TURNAROUND_OPTIONS.map((o) => (
                <Chip key={o.value} active={form.turnaround === o.value} onClick={() => set('turnaround', o.value)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p className={styles.wizardLabel}>Rate per video</p>
            <div className={formFieldStyles.chips}>
              {RATE_BAND_OPTIONS.map((o) => (
                <Chip key={o.value} active={form.rateBand === o.value} onClick={() => set('rateBand', o.value)}>
                  {o.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className={styles.wizardGroups}>
          <FormField
            label="Instagram handle"
            placeholder="@yourhandle"
            value={instagram?.handle ?? ''}
            onChange={(e) => set('socialProfiles', [{ platform: 'instagram', handle: e.target.value }])}
          />

          <div className={styles.reviewSummary}>
            <p className={styles.reviewTitle}>Interval ho gaya. Last look before submit.</p>
            <p>
              <strong>{form.fullName}</strong> · {form.city}
            </p>
            <p>
              {form.phone} · {form.email}
            </p>
            <p>
              {categoryLabel} · {form.contentStyles.join(', ')}
            </p>
            <p>{form.languages.join(', ')}</p>
            <p className={styles.reviewNote}>
              A real person reviews this, usually within 48 hours. Track your status from the dashboard.
            </p>
          </div>
        </div>
      )}
    </WizardShell>
  );
}
