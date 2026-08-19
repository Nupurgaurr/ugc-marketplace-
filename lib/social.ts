import type { SocialPlatform } from '@/lib/types';

/**
 * Handle normalisation and per-platform validation.
 *
 * Creators paste whatever is in their address bar. Rather than refuse it,
 * every platform below knows how to reduce a full profile URL down to the
 * handle it actually stores, so `https://www.instagram.com/someone/?hl=en`
 * and `@someone` end up as the same row.
 */

interface PlatformRule {
  /** Path segments that are part of the URL shape, not the handle. */
  urlHosts: string[];
  /** Matches the stored handle, once normalised. */
  pattern: RegExp;
  /** Shown when `pattern` fails. */
  hint: string;
  placeholder: string;
}

const HANDLE = /^[A-Za-z0-9._-]{1,60}$/;

const RULES: Record<SocialPlatform, PlatformRule> = {
  instagram: {
    urlHosts: ['instagram.com'],
    pattern: HANDLE,
    hint: 'Instagram handle mein sirf letters, numbers, dot aur underscore chalte hain.',
    placeholder: 'yourhandle',
  },
  youtube: {
    urlHosts: ['youtube.com', 'youtu.be'],
    pattern: HANDLE,
    hint: 'YouTube handle daalo, jaise @yourchannel.',
    placeholder: 'yourchannel',
  },
  tiktok: {
    urlHosts: ['tiktok.com'],
    pattern: HANDLE,
    hint: 'TikTok handle theek nahi lag raha.',
    placeholder: 'yourhandle',
  },
  facebook: {
    urlHosts: ['facebook.com', 'fb.com'],
    pattern: HANDLE,
    hint: 'Facebook page ka naam ya handle daalo.',
    placeholder: 'yourpage',
  },
  linkedin: {
    urlHosts: ['linkedin.com'],
    pattern: HANDLE,
    hint: 'LinkedIn profile ka handle daalo.',
    placeholder: 'your-name',
  },
  x: {
    urlHosts: ['x.com', 'twitter.com'],
    pattern: /^[A-Za-z0-9_]{1,15}$/,
    hint: 'X handle 15 characters tak hota hai, sirf letters, numbers aur underscore.',
    placeholder: 'yourhandle',
  },
  snapchat: {
    urlHosts: ['snapchat.com'],
    pattern: HANDLE,
    hint: 'Snapchat username theek nahi lag raha.',
    placeholder: 'yourhandle',
  },
  website: {
    urlHosts: [],
    pattern: /^https?:\/\/[^\s]+\.[^\s]{2,}$/,
    hint: 'Poora URL daalo, https:// ke saath.',
    placeholder: 'https://yoursite.com',
  },
};

/** Path segments platforms put in front of a handle. */
const IGNORED_SEGMENTS = new Set(['c', 'channel', 'user', 'in', 'add', 'pages', 'profile']);

export function normaliseHandle(platform: SocialPlatform, raw: string): string {
  const value = raw.trim();
  if (!value) return '';

  // A website keeps its whole URL; everything else reduces to a handle.
  if (platform === 'website') {
    if (!value) return '';
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  }

  let working = value;

  const looksLikeUrl = RULES[platform].urlHosts.some((host) => working.toLowerCase().includes(host));
  if (looksLikeUrl) {
    try {
      const url = new URL(/^https?:\/\//i.test(working) ? working : `https://${working}`);
      const segments = url.pathname.split('/').filter(Boolean);
      const handleSegment = segments.find((segment) => !IGNORED_SEGMENTS.has(segment.toLowerCase()));
      working = handleSegment ?? '';
    } catch {
      // Not a parseable URL after all; fall through and clean it as a handle.
    }
  }

  return working.replace(/^@+/, '').replace(/\/+$/, '').trim();
}

export function validateHandle(platform: SocialPlatform, handle: string): string | null {
  const rule = RULES[platform];
  if (!handle) return 'Handle chahiye.';
  return rule.pattern.test(handle) ? null : rule.hint;
}

export function handlePlaceholder(platform: SocialPlatform): string {
  return RULES[platform].placeholder;
}

/** Instagram is always present and always first. */
export const PRIMARY_PLATFORM: SocialPlatform = 'instagram';

export const ADDITIONAL_PLATFORMS: SocialPlatform[] = [
  'youtube',
  'tiktok',
  'facebook',
  'linkedin',
  'x',
  'snapchat',
  'website',
];
