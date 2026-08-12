'use client';

import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/utils';
import styles from './client.module.css';

/** Ecommerce-style filter dropdown: a pill button that opens a checklist
 *  panel, closes on outside click. Selection applies live, no "Apply" step. */
export default function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div className={styles.dropdown} ref={ref}>
      <button
        type="button"
        className={cx(styles.dropdownBtn, selected.length > 0 && styles.dropdownBtnActive)}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
        {selected.length > 0 && <span className={styles.dropdownCount}>{selected.length}</span>}
        <span className={styles.caret} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className={styles.dropdownPanel} role="listbox">
          {options.map((opt) => (
            <label className={styles.option} key={opt}>
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
              {opt}
            </label>
          ))}
          {selected.length > 0 && (
            <button type="button" className={styles.clearBtn} onClick={onClear}>
              Clear {label.toLowerCase()}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
