'use client';

import { Check } from 'lucide-react';
import { cx } from '@/lib/utils';
import styles from './OptionTile.module.css';

export interface Option {
  value: string;
  label: string;
  /** Set for labels written in a non-Latin script. */
  script?: boolean;
  /** Set only for right-to-left scripts, so dir lands on the label and not
   *  on the container around it. */
  rtl?: boolean;
}

/**
 * The one selector control in the product. A bordered rectangular tile with
 * a check that appears when it is on. Used for both single and multi select,
 * which differ only in role and in what a click does.
 */
export default function OptionTile({
  option,
  selected,
  multiple,
  onToggle,
}: {
  option: Option;
  selected: boolean;
  multiple: boolean;
  onToggle: (value: string) => void;
}) {
  return (
    <button
      type="button"
      role={multiple ? 'checkbox' : 'radio'}
      aria-checked={selected}
      className={cx(styles.tile, selected && styles.tileOn)}
      onClick={() => onToggle(option.value)}
    >
      <span
        className={cx(option.script && styles.scriptLabel)}
        dir={option.rtl ? 'rtl' : undefined}
      >
        {option.label}
      </span>
      <Check className={cx(styles.check, selected && styles.checkOn)} size={16} aria-hidden="true" />
    </button>
  );
}

export function OptionTileGroup({
  options,
  value,
  multiple,
  onChange,
  label,
}: {
  options: Option[];
  /** A single value, or the selected set. */
  value: string | string[];
  multiple: boolean;
  onChange: (next: string | string[]) => void;
  label: string;
}) {
  const selectedValues = Array.isArray(value) ? value : [value];

  const toggle = (next: string) => {
    if (!multiple) {
      onChange(next);
      return;
    }
    const current = Array.isArray(value) ? value : [];
    onChange(current.includes(next) ? current.filter((v) => v !== next) : [...current, next]);
  };

  return (
    <div className={styles.grid} role={multiple ? 'group' : 'radiogroup'} aria-label={label}>
      {options.map((option) => (
        <OptionTile
          key={option.value}
          option={option}
          selected={selectedValues.includes(option.value)}
          multiple={multiple}
          onToggle={toggle}
        />
      ))}
    </div>
  );
}
