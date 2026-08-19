/** Shared GSAP defaults so every animation in the app uses the same feel. */
export const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
export const EASE_SOFT = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Reveal travel distance, read from --reveal-y so no component hardcodes a
 *  pixel value. GSAP cannot resolve a CSS variable inside a transform, so it
 *  is resolved here instead. */
export function revealDistance(): number {
  if (typeof window === 'undefined') return 20;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--reveal-y');
  return Number.parseFloat(raw) || 20;
}

/**
 * Every reveal in the product fires off these. One threshold and one root
 * margin means two elements at the same height on screen reveal together
 * instead of drifting apart.
 *
 * The negative bottom margin is what makes "meaningfully in view" true: the
 * observer ignores the bottom 12% of the viewport, so nothing fires while it
 * is still a sliver past the fold.
 */
export const REVEAL_THRESHOLD = 0.25;
export const REVEAL_ROOT_MARGIN = '0px 0px -12% 0px';

/** Matches --duration-slow. */
export const REVEAL_DURATION = 0.6;
