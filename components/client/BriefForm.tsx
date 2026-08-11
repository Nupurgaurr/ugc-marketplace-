'use client';

import { useState } from 'react';
import { Chip } from '@/components/shared/Tag';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { NICHES } from '@/lib/data/creators';
import styles from './client.module.css';

export default function BriefForm() {
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className={styles.empty} style={{ borderStyle: 'solid', color: 'var(--bcm-crema)' }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'var(--step-1)', marginBottom: '0.5rem' }}>
          Brief received.
        </p>
        <p style={{ color: 'var(--bcm-ash)' }}>
          Our team will suggest a shortlist of matching creators — check Requests for updates.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '560px', display: 'grid', gap: '1.4rem' }}>
      <div>
        <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)', marginBottom: '0.6rem' }}>Category</p>
        <div className={styles.filterChips}>
          {NICHES.map((n) => (
            <Chip key={n} active={category === n} onClick={() => setCategory(n)}>
              {n}
            </Chip>
          ))}
        </div>
      </div>
      <FormField label="Budget for this campaign" placeholder="e.g. ₹40,000" value={budget} onChange={(e) => setBudget(e.target.value)} />
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <span style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)' }}>What do you need</span>
        <textarea
          rows={4}
          placeholder="Tell us the campaign, content style, languages and timeline…"
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
      <Button variant="primary" arrow disabled={!category || !description.trim()} onClick={() => setSent(true)}>
        Submit brief
      </Button>
    </div>
  );
}
