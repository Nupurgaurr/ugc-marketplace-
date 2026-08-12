/**
 * Rejection roasts — shown on /creator/pitches when a pitch is passed on.
 * Original lines only. Guardrails (see PROJECT_REPORT.md):
 *   - Target the situation, never the creator's ability, looks or worth.
 *   - Every roast is paired with a live next action in the UI, never shown alone.
 *   - Never used for an admin-rejected *application* — that's a real
 *     livelihood moment and gets plain, respectful copy instead (see
 *     components/creator/StatusTracker.tsx).
 */
export const PITCH_PASS_ROASTS = [
  'Pass. Unka loss. (Probably.)',
  'Not this one. Aage badho.',
  'They went with someone else. Ho jata hai.',
  'Didn’t land. Next brief is already waiting.',
  'Close, but no. Keep the reel, lose nothing.',
  'Unlucky. Or maybe just early — try the next one.',
  'They picked someone else. So it goes.',
  'No hard feelings. Theirs to lose, honestly.',
];

export function randomRoast(): string {
  return PITCH_PASS_ROASTS[Math.floor(Math.random() * PITCH_PASS_ROASTS.length)];
}
