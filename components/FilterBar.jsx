'use client';

import { useState } from 'react';
import { FILTER_GROUPS, countSelected } from '@/lib/filters';
import styles from './discovery.module.css';

/**
 * The five filters named in the report — category, content style, language,
 * location, rate. One open group at a time keeps the bar shallow enough to work
 * as a horizontal rail on mobile without a separate sheet component.
 */
export default function FilterBar({ selection, onChange, onClear, query, onQueryChange }) {
  const [openGroup, setOpenGroup] = useState(null);
  const active = countSelected(selection);
  const group = FILTER_GROUPS.find((g) => g.id === openGroup);

  const toggleOption = (groupId, option) => {
    const current = selection[groupId] ?? [];
    const next = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    onChange({ ...selection, [groupId]: next });
  };

  return (
    <div className={styles.filterBar}>
      <div className="container">
        <div className={styles.filterRow} role="group" aria-label="Filter creators">
          <label className={styles.search}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search niche, style, language, city"
              aria-label="Search creators"
            />
          </label>
          {FILTER_GROUPS.map((g) => {
            const n = (selection[g.id] ?? []).length;
            const isOpen = openGroup === g.id;
            return (
              <button
                key={g.id}
                type="button"
                className={`${styles.chip} ${n > 0 ? styles.chipActive : ''}`}
                aria-expanded={isOpen}
                onClick={() => setOpenGroup(isOpen ? null : g.id)}
              >
                {g.label}
                {n > 0 && <span className={styles.chipCount}>{n}</span>}
                <span className={`${styles.caret} ${isOpen ? styles.caretOpen : ''}`} aria-hidden="true">
                  ▾
                </span>
              </button>
            );
          })}
          {(active > 0 || query) && (
            <button type="button" className={styles.clear} onClick={onClear}>
              Clear all
            </button>
          )}
        </div>

        {group && (
          <div className={styles.panel}>
            <div className={styles.options}>
              {group.options.map((option) => {
                const on = (selection[group.id] ?? []).includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.option} ${on ? styles.optionOn : ''}`}
                    aria-pressed={on}
                    onClick={() => toggleOption(group.id, option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
