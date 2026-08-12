'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chip } from '@/components/shared/Tag';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { NICHES, CONTENT_STYLES, LANGUAGES } from '@/lib/data/creators';
import { BUDGET_BANDS } from '@/lib/data/clients';
import { createBrief, DELIVERABLE_PRESETS } from '@/lib/data/briefs';
import { ROUTES } from '@/lib/routes';
import styles from './client.module.css';

export default function BriefForm() {
  const router = useRouter();
  const { session } = useAuth('client');
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [contentStyles, setContentStyles] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [budgetBand, setBudgetBand] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [deadline, setDeadline] = useState('');
  const [description, setDescription] = useState('');
  const [sent, setSent] = useState(false);

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const canSubmit =
    session && title.trim() && categories.length > 0 && budgetBand && deliverables && deadline && description.trim();

  const submit = () => {
    if (!session || !canSubmit) return;
    createBrief({
      clientId: session.id,
      clientBrand: session.name,
      title,
      categories,
      contentStyles,
      languages,
      budgetBand,
      deliverables,
      deadline,
      description,
    });
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.empty} style={{ borderStyle: 'solid', color: 'var(--bcm-crema)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--step-1)', marginBottom: '0.5rem' }}>
          Brief submitted for review.
        </p>
        <p style={{ color: 'var(--bcm-ash)', marginBottom: '1.2rem' }}>
          Admin approves it before creators can see and pitch on it — usually within a day.
        </p>
        <Button variant="secondary" onClick={() => router.push(ROUTES.client.briefs)}>
          View your briefs
        </Button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', display: 'grid', gap: '1.4rem' }}>
      <FormField label="Brief title" placeholder="e.g. SPF range launch" value={title} onChange={(e) => setTitle(e.target.value)} />

      <div>
        <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Category</p>
        <div className={styles.filterChips}>
          {NICHES.map((n) => (
            <Chip key={n} active={categories.includes(n)} onClick={() => toggle(categories, setCategories, n)}>
              {n}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Content styles</p>
        <div className={styles.filterChips}>
          {CONTENT_STYLES.map((s) => (
            <Chip key={s} active={contentStyles.includes(s)} onClick={() => toggle(contentStyles, setContentStyles, s)}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Languages</p>
        <div className={styles.filterChips}>
          {LANGUAGES.map((l) => (
            <Chip key={l} active={languages.includes(l)} onClick={() => toggle(languages, setLanguages, l)}>
              {l}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Budget</p>
        <div className={styles.filterChips}>
          {BUDGET_BANDS.map((b) => (
            <Chip key={b} active={budgetBand === b} onClick={() => setBudgetBand(b)}>
              {b}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Deliverables</p>
        <div className={styles.filterChips}>
          {DELIVERABLE_PRESETS.map((d) => (
            <Chip key={d} active={deliverables === d} onClick={() => setDeliverables(d)}>
              {d}
            </Chip>
          ))}
        </div>
      </div>

      <FormField label="Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <span style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)' }}>What do you need</span>
        <textarea
          rows={4}
          placeholder="Tell creators what this campaign is, the tone, anything they should know…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            background: 'var(--bcm-roast)',
            border: '1px solid var(--bcm-line-strong)',
            borderRadius: 'var(--radius)',
            padding: '0.85rem 1rem',
            color: 'var(--bcm-crema)',
            fontSize: 'var(--step-0)',
            resize: 'vertical',
          }}
        />
      </label>

      <Button variant="primary" arrow disabled={!canSubmit} onClick={submit}>
        Submit brief
      </Button>
    </div>
  );
}
