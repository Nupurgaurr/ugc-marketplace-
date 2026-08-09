import { creators } from './creators';

/**
 * Single seam between the UI and the backend.
 *
 * Today: returns the local mock array.
 * Later: `fetch(`${process.env.NEXT_PUBLIC_API_URL}/creators?status=approved`)`
 * against the Node API, which reads Postgres and returns signed Mux /
 * CloudFront playback URLs on `preview`.
 *
 * Only approved creators are ever returned — the admin approval queue in the
 * report is what flips `status`, and the public site must never see anything else.
 */
export async function getApprovedCreators() {
  return creators.filter((c) => c.status === 'approved');
}

/**
 * Placeholder for the authenticated actions. Both require an account per the
 * report: browsing is open, saving a shortlist or sending a request is not.
 */
export async function saveShortlist(/* creatorIds */) {
  throw new Error('AUTH_REQUIRED');
}

export async function requestCreator(/* creatorId */) {
  throw new Error('AUTH_REQUIRED');
}

export async function submitBrief(/* brief */) {
  throw new Error('AUTH_REQUIRED');
}
