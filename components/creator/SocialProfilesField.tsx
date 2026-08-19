'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ADDITIONAL_PLATFORMS, handlePlaceholder, PRIMARY_PLATFORM } from '@/lib/social';
import { PLATFORM_LABELS } from '@/lib/options';
import { cx } from '@/lib/utils';
import type { SocialPlatform } from '@/lib/types';
import styles from './SocialProfilesField.module.css';

export interface SocialProfileValue {
  platform: SocialPlatform;
  handle: string;
  /** Optional here because the form holds the schema's input shape; Zod
   *  defaults it to null on parse. */
  followerCount?: number | null;
}

/**
 * Instagram is mandatory and always the first row. Everything below it is
 * added one platform at a time from a dropdown of what is left, and each
 * added row can be removed. One row per profile: nothing here joins handles
 * into a string.
 */
export default function SocialProfilesField({
  value,
  onChange,
  errors,
}: {
  value: SocialProfileValue[];
  onChange: (next: SocialProfileValue[]) => void;
  errors?: Record<number, string | undefined>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const used = new Set(value.map((row) => row.platform));
  const available = ADDITIONAL_PLATFORMS.filter((platform) => !used.has(platform));

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const setRow = (index: number, patch: Partial<SocialProfileValue>) =>
    onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addPlatform = (platform: SocialPlatform) => {
    onChange([...value, { platform, handle: '', followerCount: null }]);
    setMenuOpen(false);
  };

  const removeRow = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className={styles.wrap}>
      {value.map((row, index) => {
        const isPrimary = row.platform === PRIMARY_PLATFORM;
        return (
          <div className={styles.row} key={row.platform}>
            <div className={styles.rowHead}>
              <span className={styles.platform}>{PLATFORM_LABELS[row.platform]}</span>
              {isPrimary ? (
                <span className={styles.required}>Required</span>
              ) : (
                <button
                  type="button"
                  className={styles.remove}
                  onClick={() => removeRow(index)}
                  aria-label={`Remove ${PLATFORM_LABELS[row.platform]}`}
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className={cx(styles.inputs, isPrimary && styles.inputsPrimary)}>
              <input
                className={styles.input}
                value={row.handle}
                placeholder={handlePlaceholder(row.platform)}
                aria-label={`${PLATFORM_LABELS[row.platform]} handle`}
                onChange={(e) => setRow(index, { handle: e.target.value })}
              />

              {isPrimary && (
                <input
                  className={cx(styles.input, styles.followers)}
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={row.followerCount ?? ''}
                  placeholder="Followers"
                  aria-label="Instagram follower count"
                  onChange={(e) =>
                    setRow(index, {
                      followerCount: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                />
              )}
            </div>

            {errors?.[index] && <p className={styles.error}>{errors[index]}</p>}
          </div>
        );
      })}

      {available.length > 0 && (
        <div className={styles.addWrap} ref={menuRef}>
          <button
            type="button"
            className={styles.add}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <Plus size={16} aria-hidden="true" />
            Add another profile
          </button>

          {menuOpen && (
            <div className={styles.menu} role="menu">
              {available.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => addPlatform(platform)}
                >
                  {PLATFORM_LABELS[platform]}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
