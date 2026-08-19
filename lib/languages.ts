/**
 * Languages a creator shoots in. Each label is written in its own script,
 * never transliterated into English.
 *
 * `Hanken Grotesk` carries none of these scripts, so the Indic and Arabic
 * labels fall back to whatever the OS supplies unless the matching Noto Sans
 * subset is loaded. app/layout.tsx loads them and exposes --font-indic;
 * anything rendering `label` must use that stack.
 *
 * Urdu is right to left. Set dir="rtl" on the label element itself, never on
 * its container, or the surrounding layout flips with it.
 */

export interface Language {
  value: string;
  label: string;
  /** true only for scripts that read right to left. */
  rtl?: boolean;
}

export const LANGUAGES: Language[] = [
  { value: 'hindi', label: 'हिंदी' },
  { value: 'english', label: 'English' },
  { value: 'tamil', label: 'தமிழ்' },
  { value: 'telugu', label: 'తెలుగు' },
  { value: 'marathi', label: 'मराठी' },
  { value: 'bengali', label: 'বাংলা' },
  { value: 'gujarati', label: 'ગુજરાતી' },
  { value: 'malayalam', label: 'മലയാളം' },
  { value: 'punjabi', label: 'ਪੰਜਾਬੀ' },
  { value: 'kannada', label: 'ಕನ್ನಡ' },
  { value: 'urdu', label: 'اردو', rtl: true },
  { value: 'konkani', label: 'कोंकणी' },
];

const BY_VALUE = new Map(LANGUAGES.map((l) => [l.value, l]));

export function languageLabel(value: string): string {
  return BY_VALUE.get(value)?.label ?? value;
}

export function isRtlLanguage(value: string): boolean {
  return BY_VALUE.get(value)?.rtl ?? false;
}
