'use client';

import { useState } from 'react';
import type { Brief } from '@/lib/types';
import Modal, { modalStyles } from '@/components/shared/Modal';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { createPitch } from '@/lib/data/briefs';

const NOTE_MAX = 400;

export default function PitchModal({
  brief,
  onClose,
  onSent,
}: {
  brief: Brief | null;
  onClose: () => void;
  onSent: () => void;
}) {
  const { session } = useAuth('creator');
  const [note, setNote] = useState('');
  const [linksText, setLinksText] = useState('');
  const [rate, setRate] = useState('');
  const [sent, setSent] = useState(false);

  const close = () => {
    setNote('');
    setLinksText('');
    setRate('');
    setSent(false);
    onClose();
  };

  const submit = () => {
    if (!session || !brief || !note.trim() || !rate.trim()) return;
    const sampleLinks = linksText
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 3);
    createPitch({
      briefId: brief.id,
      creatorId: session.id,
      creatorName: session.name,
      note: note.slice(0, NOTE_MAX),
      sampleLinks,
      quotedRate: rate,
    });
    setSent(true);
    onSent();
  };

  return (
    <Modal open={!!brief} onClose={close} title={sent ? 'Pitch sent' : `Pitch on "${brief?.title ?? ''}"`}>
      {sent ? (
        <>
          <p className={modalStyles.body}>{brief?.clientBrand} will see your pitch alongside everyone else&rsquo;s. Track it from My pitches.</p>
          <div className={modalStyles.actions}>
            <Button variant="primary" block onClick={close}>
              Done
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className={modalStyles.body}>One pitch per brief. Make it count.</p>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.2rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <span style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)' }}>
                Why you ({note.length}/{NOTE_MAX})
              </span>
              <textarea
                rows={3}
                maxLength={NOTE_MAX}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Quick note on why you fit this brief…"
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
            <FormField label="Up to 3 sample links" placeholder="Separate with commas" value={linksText} onChange={(e) => setLinksText(e.target.value)} />
            <FormField label="Your rate for this brief" placeholder="e.g. ₹12,000 for 3 videos" value={rate} onChange={(e) => setRate(e.target.value)} />
          </div>
          <div className={modalStyles.actions}>
            <Button variant="primary" block arrow onClick={submit} disabled={!note.trim() || !rate.trim()}>
              Send pitch
            </Button>
            <Button variant="ghost" block onClick={close}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}
