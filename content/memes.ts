/**
 * Meme asset manifest. Every slot ships EMPTY. No film stills, GIFs or
 * copyrighted clips are sourced, embedded or committed here; that is a real
 * legal exposure for a commercial client-facing product. See
 * HANDOVER_GUIDE.md → "Swapping in real meme content".
 *
 * With no `src`, MemeSlot renders a bold typographic fallback using
 * `caption`. The page is fully shippable and still funny with zero assets
 * loaded. Fill in `src` (a path under /public/media/memes/) once Dhruv has
 * licensed, self-made or properly cleared assets. Nothing else changes.
 */

export interface MemeManifestEntry {
  src?: string;
  alt: string;
  credit?: string;
}

export const MEME_MANIFEST: Record<string, MemeManifestEntry> = {
  'roast-04': { alt: 'Reaction beat, the "200 reels, ₹0 lifetime earnings" moment.' },
  'roast-07': { alt: 'Reaction beat, the turn, brands are short on reliability not creators.' },
  'roast-haan': { alt: 'Hover reveal behind the Haan button.' },
  'roast-nahi': { alt: 'Reaction beat, the "darr gayi" moment behind the Nahi button.' },
  'pending-01': { alt: 'Corner beat on the waiting stage.' },
};
