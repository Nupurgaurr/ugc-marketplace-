'use client';

import { useState } from 'react';
import type { Creator } from '@/lib/types';
import Modal, { modalStyles } from '@/components/shared/Modal';
import FormField from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { createRequest } from '@/lib/data/requests';

export default function RequestModal({
  creator,
  onClose,
  onSent,
}: {
  creator: Creator | null;
  onClose: () => void;
  onSent: () => void;
}) {
  const { session } = useAuth('client');
  const [campaign, setCampaign] = useState('');
  const [need, setNeed] = useState('');
  const [sent, setSent] = useState(false);

  const close = () => {
    setCampaign('');
    setNeed('');
    setSent(false);
    onClose();
  };

  const submit = () => {
    if (!session || !creator || !campaign.trim() || !need.trim()) return;
    createRequest({
      clientId: session.id,
      clientBrand: session.name,
      creatorId: creator.id,
      creatorName: creator.name,
      campaign,
      need,
    });
    setSent(true);
    onSent();
  };

  return (
    <Modal open={!!creator} onClose={close} title={sent ? 'Request sent' : `Request ${creator?.name ?? ''}`}>
      {sent ? (
        <>
          <p className={modalStyles.body}>
            We&rsquo;ll check {creator?.name} is free for your dates and confirm the rate before anything is
            committed. Track it from Requests.
          </p>
          <div className={modalStyles.actions}>
            <Button variant="primary" block onClick={close}>
              Done
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className={modalStyles.body}>Tell us the campaign and what you need — we coordinate the rest.</p>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.2rem' }}>
            <FormField label="Campaign name" placeholder="e.g. SPF range launch" value={campaign} onChange={(e) => setCampaign(e.target.value)} />
            <FormField label="What do you need" placeholder="e.g. 3 videos · Unboxing · Hindi" value={need} onChange={(e) => setNeed(e.target.value)} />
          </div>
          <div className={modalStyles.actions}>
            <Button variant="primary" block arrow onClick={submit} disabled={!campaign.trim() || !need.trim()}>
              Send request
            </Button>
            <Button variant="ghost" block onClick={close}>
              Cancel
            </Button>
          </div>
          <p className={modalStyles.note}>Prototype — this creates a mock request record, nothing is sent externally.</p>
        </>
      )}
    </Modal>
  );
}
