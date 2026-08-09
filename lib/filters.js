import { creators } from './creators';

/**
 * The five filters specified in the report: category, content style, language,
 * location, budget/rate. Options are derived from the data so this file stays
 * correct when the data source becomes a real API.
 */

const unique = (values) => [...new Set(values)].sort((a, b) => a.localeCompare(b));

export const RATE_BANDS = [
  { id: 'under10', label: 'Under ₹10k', test: (c) => c.rateMin < 10000 },
  { id: '10to20', label: '₹10k – ₹20k', test: (c) => c.rateMax >= 10000 && c.rateMin <= 20000 },
  { id: 'over20', label: '₹20k +', test: (c) => c.rateMax > 20000 },
];

export const FILTER_GROUPS = [
  {
    id: 'category',
    label: 'Category',
    options: unique(creators.map((c) => c.category)),
    match: (creator, selected) => selected.includes(creator.category),
  },
  {
    id: 'contentStyle',
    label: 'Content style',
    options: unique(creators.flatMap((c) => c.contentStyles)),
    match: (creator, selected) => creator.contentStyles.some((s) => selected.includes(s)),
  },
  {
    id: 'language',
    label: 'Language',
    options: unique(creators.flatMap((c) => c.languages)),
    match: (creator, selected) => creator.languages.some((l) => selected.includes(l)),
  },
  {
    id: 'location',
    label: 'Location',
    options: unique(creators.map((c) => c.city)),
    match: (creator, selected) => selected.includes(creator.city),
  },
  {
    id: 'rate',
    label: 'Rate',
    options: RATE_BANDS.map((b) => b.label),
    match: (creator, selected) =>
      RATE_BANDS.filter((b) => selected.includes(b.label)).some((b) => b.test(creator)),
  },
];

export const emptySelection = () =>
  FILTER_GROUPS.reduce((acc, group) => ({ ...acc, [group.id]: [] }), {});

/** Pure. Same signature the server-side query will expose later. */
export function applyFilters(list, selection) {
  return list.filter((creator) =>
    FILTER_GROUPS.every((group) => {
      const selected = selection[group.id] ?? [];
      return selected.length === 0 || group.match(creator, selected);
    })
  );
}

/** Free-text search across the fields the report's wireframe search box names. */
export function searchCreators(list, query) {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) =>
    [c.name, c.category, c.city, c.state, ...c.contentStyles, ...c.languages]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );
}

export function countSelected(selection) {
  return Object.values(selection).reduce((n, arr) => n + arr.length, 0);
}
