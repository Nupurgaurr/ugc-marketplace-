'use client';

import { useState } from 'react';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { getCreatorById } from '@/lib/data/creators';

export default function ProfileEditor() {
  const { session } = useAuth('creator');
  const creator = session ? getCreatorById(session.id) : undefined;
  const [bio, setBio] = useState(creator?.bio ?? '');
  const [availability, setAvailability] = useState(creator?.availability ?? '');
  const [saved, setSaved] = useState(false);

  if (!creator) return null;

  const save = () => {
    creator.bio = bio;
    creator.availability = availability;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ display: 'grid', gap: '1.2rem', maxWidth: '760px' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        <span style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)' }}>Bio</span>
        <textarea
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
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
      <FormField label="Availability" value={availability} onChange={(e) => setAvailability(e.target.value)} />
      <Button variant="primary" onClick={save}>
        {saved ? 'Saved' : 'Save changes'}
      </Button>
    </div>
  );
}
