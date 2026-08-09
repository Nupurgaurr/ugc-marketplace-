import Eyebrow from './ui/Eyebrow';
import styles from './creator.module.css';

/**
 * Visual preview only — the real inbox belongs to the creator dashboard. Shown
 * here because "what actually happens after I'm approved" is the question every
 * applicant has.
 */
export default function RequestInbox({ requests }) {
  return (
    <section className="section section--ruled" id="requests">
      <div className="container">
        <Eyebrow>Incoming requests</Eyebrow>
        <h2 className="display" style={{ maxWidth: '18ch' }}>
          Work arrives as a request. <em>You decide.</em>
        </h2>

        <div className={styles.inbox}>
          <div className={styles.inboxBar}>
            <span className={styles.inboxTitle}>Requests</span>
            <span className={styles.inboxStamp}>Preview of the creator dashboard</span>
          </div>

          {requests.map((request) => (
            <div className={styles.request} key={request.id}>
              <div>
                <p className={styles.reqBrand}>{request.brand}</p>
                <p className={styles.reqCampaign}>{request.campaign}</p>
              </div>
              <p className={styles.reqNeed}>{request.need}</p>
              <span
                className={`${styles.status} ${
                  request.status === 'New' ? styles.statusNew : ''
                }`}
              >
                {request.status}
              </span>
              <span className={styles.reqAction}>
                {request.status === 'New' ? 'Review' : 'Open'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
