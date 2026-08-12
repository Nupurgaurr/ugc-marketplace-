import { creators, getPendingCreators } from './creators';
import { clients, getPendingClients } from './clients';
import { requests } from './requests';
import { getPendingBriefs } from './briefs';

/** Derived admin overview numbers. Real version becomes a single
 *  `GET /api/admin/overview` aggregate query. */
export function getAdminOverview() {
  const approvedCreators = creators.filter((c) => c.status === 'approved').length;
  const pendingCreators = getPendingCreators().length;
  const approvedClients = clients.filter((c) => c.status === 'approved').length;
  const pendingClients = getPendingClients().length;
  const pendingBriefs = getPendingBriefs().length;
  const activeRequests = requests.filter((r) => r.status === 'requested' || r.status === 'accepted').length;
  const avgReviewHours = 6;

  return {
    approvedCreators,
    pendingCreators,
    approvedClients,
    pendingClients,
    pendingBriefs,
    activeRequests,
    totalRequests: requests.length,
    avgReviewHours,
  };
}
