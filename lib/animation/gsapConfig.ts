/** Shared GSAP defaults so every animation in the app uses the same feel. */
export const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)';
export const EASE_SOFT = 'cubic-bezier(0.16, 1, 0.3, 1)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
