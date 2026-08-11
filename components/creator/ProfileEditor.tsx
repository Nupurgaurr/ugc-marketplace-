'use client';

import { useState } from 'react';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { Chip } from '@/components/shared/Tag';
import { useAuth } from '@/lib/auth/useAuth';
import { getCreatorById, CONTENT_STYLES } from '@/lib/data/creators';
import { makeId } from '@/lib/utils';
import type { PortfolioItem } from '@/lib/types';
import styles from './creator.module.css';

const DEMO_MEDIA = { posterUrl: '/media/creators/aisha-rahman.jpg', previewUrl: '/media/creators/aisha-rahman.mp4', durationSec: 6 };

export default function ProfileEditor() {
  const { session } = useAuth('creator');
  const creator = session ? getCreatorById(session.id) : undefined;
  const [bio, setBio] = useState(creator?.bio ?? '');
  const [availability, setAvailability] = useState(creator?.availability ?? '');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(creator?.portfolio ?? []);
  const [newTitle, setNewTitle] = useState('');
  const [newStyle, setNewStyle] = useState('');
  const [saved, setSaved] = useState(false);

  if (!creator) return null;

  const save = () => {
    creator.bio = bio;
    creator.availability = availability;
    creator.portfolio = portfolio;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addPortfolioItem = () => {
    if (!newTitle.trim() || !newStyle) return;
    setPortfolio((p) => [...p, { id: makeId('p'), title: newTitle, style: newStyle, ...DEMO_MEDIA }]);
    setNewTitle('');
    setNewStyle('');
  };

  const removeItem = (id: string) => setPortfolio((p) => p.filter((item) => item.id !== id));

  return (
    <div style={{ display: 'grid', gap: '2.4rem', maxWidth: '760px' }}>
      <div style={{ display: 'grid', gap: '1.2rem' }}>
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
          {saved ? 'Saved ✓' : 'Save changes'}
        </Button>
      </div>

      <div>
        <p className={styles.sectionTitle}>Portfolio</p>
        <div className={styles.portfolioGrid}>
          {portfolio.map((item) => (
            <div className={styles.portfolioTile} key={item.id}>
              <div className={styles.portfolioTileMedia}>
                <img src={item.posterUrl} alt={item.title} />
              </div>
              <div className={styles.portfolioTileBody}>
                <span className={styles.portfolioTileTitle}>{item.title}</span>
                <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`} style={{ color: 'var(--status-danger)' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
          <div className={styles.addTile}>
            <div style={{ display: 'grid', gap: '0.6rem', width: '90%' }}>
              <input
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                style={{
                  background: 'var(--bcm-grounds)',
                  border: '1px solid var(--bcm-line-strong)',
                  borderRadius: 'var(--radius)',
                  padding: '0.5rem 0.7rem',
                  color: 'var(--bcm-crema)',
                  fontSize: 'var(--step--1)',
                }}
              />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {CONTENT_STYLES.slice(0, 4).map((s) => (
                  <Chip key={s} active={newStyle === s} onClick={() => setNewStyle(s)}>
                    {s}
                  </Chip>
                ))}
              </div>
              <Button variant="secondary" size="small" onClick={addPortfolioItem} disabled={!newTitle.trim() || !newStyle}>
                Add clip
              </Button>
            </div>
          </div>
        </div>
        <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash-dim)', marginTop: '0.8rem' }}>
          Prototype — new clips reuse a demo preview. Real uploads plug into the video pipeline (see
          HANDOVER_GUIDE.md).
        </p>
      </div>
    </div>
  );
}
