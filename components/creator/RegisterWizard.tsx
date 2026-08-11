'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/shared/WizardShell';
import FormField, { formFieldStyles } from '@/components/shared/FormField';
import { Chip } from '@/components/shared/Tag';
import MemeBeat from './MemeBeat';
import { NICHES, CONTENT_STYLES, LANGUAGES } from '@/lib/data/creators';
import { registerCreator, type CreatorRegistration } from '@/lib/auth/mockAuth';
import { ROUTES } from '@/lib/routes';

const STEP_LABELS = ['Naam & thikana', 'Genre', 'Zubaan', 'Dikhao kaam', 'The End'];

const MEME_BEATS = [
  { emoji: '🎬', line: 'Har entry mein thoda drama hona chahiye.', caption: 'Scene 1: you, but main-character energy.' },
  { emoji: '🎤', line: 'Apna genre, apna swag — no copy-paste allowed.', caption: 'Pick your lane like it’s the opening credits.' },
  { emoji: '🗣️', line: 'Jitni zubaan, utna reach.', caption: 'Dialogue delivery matters. So does language reach.' },
  { emoji: '🎥', line: 'Ab dikhao asli talent — links bhejo, drama nahi.', caption: 'This is the item number of your application.' },
  { emoji: '🍿', line: 'Interval ho gaya — ab bas submit dabate hain.', caption: 'Baaki hum sambhal lenge.' },
];

type FormState = CreatorRegistration & { city: string };

const INITIAL: FormState = {
  name: '',
  city: '',
  phone: '',
  email: '',
  category: '',
  contentStyles: [],
  languages: [],
  handles: [],
};

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [handlesText, setHandlesText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleMulti = (key: 'contentStyles' | 'languages', value: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  };

  const validate = (): string => {
    if (step === 0) {
      if (!form.name.trim() || !form.city.trim() || !form.phone.trim() || !form.email.trim()) {
        return 'Fill in your name, city, phone and email — the basics, na.';
      }
    }
    if (step === 1) {
      if (!form.category || form.contentStyles.length === 0) return 'Pick a category and at least one content style.';
    }
    if (step === 2) {
      if (form.languages.length === 0) return 'Pick at least one language you shoot in.';
    }
    if (step === 3) {
      if (!handlesText.trim()) return 'Drop at least one handle or sample link.';
    }
    return '';
  };

  const handleNext = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');

    if (step < STEP_LABELS.length - 1) {
      if (step === 3) {
        set(
          'handles',
          handlesText
            .split(',')
            .map((h) => h.trim())
            .filter(Boolean)
        );
      }
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    registerCreator(form);
    setTimeout(() => router.push(ROUTES.creator.dashboard), 500);
  };

  const meme = MEME_BEATS[step];

  return (
    <WizardShell
      stepLabels={STEP_LABELS}
      activeIndex={step}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      isLast={step === STEP_LABELS.length - 1}
      submitting={submitting}
    >
      <MemeBeat {...meme} />

      {error && <p style={{ color: 'var(--status-danger)', marginBottom: '1.2rem', fontSize: 'var(--step--1)' }}>{error}</p>}

      {step === 0 && (
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          <FormField label="Full name" placeholder="Your name" value={form.name} onChange={(e) => set('name', e.target.value)} />
          <FormField label="City" placeholder="e.g. Mumbai" value={form.city} onChange={(e) => set('city', e.target.value)} />
          <FormField label="Phone / WhatsApp" type="tel" placeholder="+91" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <FormField label="Email" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'grid', gap: '1.6rem' }}>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Your main category</p>
            <div className={formFieldStyles.chips}>
              {NICHES.map((n) => (
                <Chip key={n} active={form.category === n} onClick={() => set('category', n)}>
                  {n}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Content styles you shoot</p>
            <div className={formFieldStyles.chips}>
              {CONTENT_STYLES.map((s) => (
                <Chip key={s} active={form.contentStyles.includes(s)} onClick={() => toggleMulti('contentStyles', s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Languages you shoot in</p>
          <div className={formFieldStyles.chips}>
            {LANGUAGES.map((l) => (
              <Chip key={l} active={form.languages.includes(l)} onClick={() => toggleMulti('languages', l)}>
                {l}
              </Chip>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          <FormField
            label="Instagram / YouTube / TikTok handles + 1-3 sample links"
            placeholder="@yourhandle, youtube.com/@you, link-to-a-video"
            value={handlesText}
            onChange={(e) => setHandlesText(e.target.value)}
          />
          <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash-dim)' }}>Separate with commas. No production house required.</p>
        </div>
      )}

      {step === 4 && (
        <div style={{ display: 'grid', gap: '0.9rem', fontSize: 'var(--step--1)', color: 'var(--bcm-ash)' }}>
          <p style={{ color: 'var(--bcm-crema)', fontFamily: 'var(--font-display)', fontSize: 'var(--step-1)', fontWeight: 600, marginBottom: '0.4rem' }}>
            Last look before it goes to the review queue.
          </p>
          <p><strong style={{ color: 'var(--bcm-crema)' }}>{form.name}</strong> · {form.city}</p>
          <p>{form.phone} · {form.email}</p>
          <p>{form.category} · {form.contentStyles.join(', ')}</p>
          <p>{form.languages.join(', ')}</p>
          <p style={{ color: 'var(--bcm-ash-dim)' }}>
            A real person reviews this — usually within a couple of days. Track your status from the dashboard.
          </p>
        </div>
      )}
    </WizardShell>
  );
}
