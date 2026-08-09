'use client';

import { useEffect, useRef } from 'react';
import Button from './ui/Button';
import styles from './ui/modal.module.css';

const COPY = {
  save: {
    title: 'Save this shortlist',
    body: 'Browsing stays open. Create an account to keep a shortlist across sessions and pick it back up later.',
    action: 'Create account',
  },
  request: {
    title: 'Send this to BCM',
    body: 'We check the creator is free for your dates and confirm the rate before anything is committed. Create an account so we know who the request is from.',
    action: 'Create account and send',
  },
  login: {
    title: 'Log in',
    body: 'Pick up your shortlist, open requests and past campaigns.',
    action: 'Log in',
  },
};

/**
 * Prototype only — no auth is wired up. In production this is the Supabase Auth
 * step described in the report; the shortlist held in session state gets written
 * against the new client record on sign-up.
 */
export default function AuthGateModal({ mode, context, onClose }) {
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    panelRef.current?.querySelector('input')?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!mode) return null;
  const copy = COPY[mode] ?? COPY.save;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={copy.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className={styles.modalTitle}>{copy.title}</h2>
        <p className={styles.modalBody}>
          {context ? `${context} ` : ''}
          {copy.body}
        </p>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Work email</span>
          <input className={styles.input} type="email" placeholder="you@brand.com" />
        </label>
        {mode !== 'login' && (
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Brand</span>
            <input className={styles.input} type="text" placeholder="Brand or company name" />
          </label>
        )}

        <div className={styles.modalActions}>
          <Button variant="primary" block arrow onClick={onClose}>
            {copy.action}
          </Button>
          <Button variant="ghost" block onClick={onClose}>
            Keep browsing
          </Button>
        </div>

        <p className={styles.modalNote}>
          Prototype — no account is created and nothing is sent. New brand accounts pass
          through BCM&apos;s light moderation check before requests go out.
        </p>
      </div>
    </div>
  );
}
