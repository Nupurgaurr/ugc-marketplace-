'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WizardShell from '@/components/shared/WizardShell';
import FormField, { formFieldStyles } from '@/components/shared/FormField';
import { Chip } from '@/components/shared/Tag';
import { NICHES, CONTENT_STYLES, LANGUAGES } from '@/lib/data/creators';
import { BUDGET_BANDS, VOLUME_BANDS, SELLS_WHERE, USAGE_RIGHTS } from '@/lib/data/clients';
import { registerClient, type ClientRegistration } from '@/lib/auth/mockAuth';
import { ROUTES } from '@/lib/routes';

const STEP_LABELS = ['Who', 'What you sell', 'What you need', 'Account'];

type FormState = ClientRegistration & { city: string; password: string; confirmPassword: string };

const INITIAL: FormState = {
  brand: '',
  website: '',
  contactName: '',
  email: '',
  phone: '',
  city: '',
  industries: [],
  sellsWhere: [],
  targetLanguages: [],
  contentStylesNeeded: [],
  monthlyBudgetBand: '',
  typicalVolume: '',
  usageRights: '',
  password: '',
  confirmPassword: '',
};

export default function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleMulti = (key: 'industries' | 'sellsWhere' | 'targetLanguages' | 'contentStylesNeeded', value: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));
  };

  const validate = (): string => {
    if (step === 0) {
      if (!form.brand.trim() || !form.contactName.trim() || !form.email.trim() || !form.phone.trim() || !form.city.trim()) {
        return 'Brand, contact name, email, phone and city — all of it, please.';
      }
    }
    if (step === 1) {
      if (form.industries.length === 0 || form.sellsWhere.length === 0 || form.targetLanguages.length === 0) {
        return 'Pick at least one industry, one sales channel and one target language.';
      }
    }
    if (step === 2) {
      if (form.contentStylesNeeded.length === 0 || !form.monthlyBudgetBand || !form.typicalVolume || !form.usageRights) {
        return 'Content style, budget, volume and usage rights — all needed.';
      }
    }
    if (step === 3) {
      if (form.password.length < 6) return 'Password should be at least 6 characters.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
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
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    const { password: _password, confirmPassword: _confirmPassword, city: _city, ...registration } = form;
    registerClient(registration);
    setTimeout(() => router.push(ROUTES.client.dashboard), 500);
  };

  return (
    <WizardShell
      stepLabels={STEP_LABELS}
      activeIndex={step}
      onBack={() => setStep((s) => Math.max(0, s - 1))}
      onNext={handleNext}
      isLast={step === STEP_LABELS.length - 1}
      submitting={submitting}
    >
      {error && <p style={{ color: 'var(--status-danger)', marginBottom: '1.2rem', fontSize: 'var(--step--1)' }}>{error}</p>}

      {step === 0 && (
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          <FormField label="Brand name" placeholder="Your brand" value={form.brand} onChange={(e) => set('brand', e.target.value)} />
          <FormField label="Website" placeholder="yourbrand.com" value={form.website} onChange={(e) => set('website', e.target.value)} />
          <FormField label="Contact name" placeholder="Your name" value={form.contactName} onChange={(e) => set('contactName', e.target.value)} />
          <FormField label="Work email" type="email" placeholder="you@brand.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
          <FormField label="Phone / WhatsApp" type="tel" placeholder="+91" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          <FormField label="City" placeholder="e.g. Mumbai" value={form.city} onChange={(e) => set('city', e.target.value)} />
        </div>
      )}

      {step === 1 && (
        <div style={{ display: 'grid', gap: '1.6rem' }}>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>What industry are you in</p>
            <div className={formFieldStyles.chips}>
              {NICHES.map((n) => (
                <Chip key={n} active={form.industries.includes(n)} onClick={() => toggleMulti('industries', n)}>
                  {n}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Where do you sell</p>
            <div className={formFieldStyles.chips}>
              {SELLS_WHERE.map((s) => (
                <Chip key={s} active={form.sellsWhere.includes(s)} onClick={() => toggleMulti('sellsWhere', s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Target markets & languages</p>
            <div className={formFieldStyles.chips}>
              {LANGUAGES.map((l) => (
                <Chip key={l} active={form.targetLanguages.includes(l)} onClick={() => toggleMulti('targetLanguages', l)}>
                  {l}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ display: 'grid', gap: '1.6rem' }}>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Content styles you want</p>
            <div className={formFieldStyles.chips}>
              {CONTENT_STYLES.map((s) => (
                <Chip key={s} active={form.contentStylesNeeded.includes(s)} onClick={() => toggleMulti('contentStylesNeeded', s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Volume per month</p>
            <div className={formFieldStyles.chips}>
              {VOLUME_BANDS.map((v) => (
                <Chip key={v} active={form.typicalVolume === v} onClick={() => set('typicalVolume', v)}>
                  {v}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Budget per video</p>
            <div className={formFieldStyles.chips}>
              {BUDGET_BANDS.map((band) => (
                <Chip key={band} active={form.monthlyBudgetBand === band} onClick={() => set('monthlyBudgetBand', band)}>
                  {band}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Usage rights needed</p>
            <div className={formFieldStyles.chips}>
              {USAGE_RIGHTS.map((u) => (
                <Chip key={u} active={form.usageRights === u} onClick={() => set('usageRights', u)}>
                  {u}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ display: 'grid', gap: '1.4rem' }}>
          <FormField label="Password" type="password" placeholder="At least 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)} />
          <FormField label="Confirm password" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} />
          <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash-dim)' }}>
            Prototype — this password is not stored anywhere. Real account security ships with the backend.
          </p>

          <div style={{ borderTop: '1px solid var(--bcm-line)', paddingTop: '1.2rem', display: 'grid', gap: '0.6rem', fontSize: 'var(--step--1)', color: 'var(--bcm-ash)' }}>
            <p style={{ color: 'var(--bcm-crema)', fontFamily: 'var(--font-display)', fontSize: 'var(--step-1)', fontWeight: 600 }}>
              Check it, then submit.
            </p>
            <p><strong style={{ color: 'var(--bcm-crema)' }}>{form.brand}</strong> · {form.website || 'no website given'} · {form.city}</p>
            <p>{form.contactName} · {form.email} · {form.phone}</p>
            <p>{form.industries.join(', ') || '—'}</p>
            <p>{form.contentStylesNeeded.join(', ') || '—'} · {form.monthlyBudgetBand} · {form.typicalVolume} · {form.usageRights}</p>
            <p style={{ color: 'var(--bcm-ash-dim)' }}>
              Your account is created instantly here and lands in the admin moderation queue for a light review — you can use the dashboard right away.
            </p>
          </div>
        </div>
      )}
    </WizardShell>
  );
}
