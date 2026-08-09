import Eyebrow from './ui/Eyebrow';
import styles from './sections.module.css';

/** Mirrors the creator status tracker in the report: Applied → In review → Approved → Live. */
const PIPELINE = ['Applied', 'In review', 'Approved', 'Live in the grid'];

const POINTS = [
  {
    title: 'Applications are public, approval is not',
    body: 'Anyone can apply to join. Nobody appears in the grid until a BCM reviewer has watched their work and checked the fit.',
  },
  {
    title: 'Brands are checked too',
    body: 'New accounts pass a light moderation check before a request reaches a creator, so creators are not fielding spam.',
  },
  {
    title: 'We stay on the campaign',
    body: 'The match is coordinated by our team and quality is reviewed before delivery. You are not left managing a stranger.',
  },
];

export default function TrustSection() {
  return (
    <section className="section section--ruled section--band">
      <div className="container">
        <Eyebrow>Vetting</Eyebrow>
        <h2 className="display" style={{ maxWidth: '17ch' }}>
          Not an open pool. <em>Every creator is reviewed first.</em>
        </h2>

        <div className={styles.pipeline}>
          {PIPELINE.map((node, i) => (
            <span key={node} style={{ display: 'contents' }}>
              <span className={`${styles.node} ${i === PIPELINE.length - 1 ? styles.nodeLive : ''}`}>
                {node}
              </span>
              {i < PIPELINE.length - 1 && (
                <span className={styles.nodeArrow} aria-hidden="true">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
        <p className="body-dim" style={{ fontSize: '0.9rem', maxWidth: '52ch' }}>
          Only creators at the final stage are visible to clients. Everything before it sits
          in an internal approval queue.
        </p>

        <div className={styles.trustGrid}>
          {POINTS.map((point) => (
            <div key={point.title}>
              <h3 className={styles.trustTitle}>{point.title}</h3>
              <p className={styles.trustBody}>{point.body}</p>
            </div>
          ))}
        </div>

        <p className={styles.credit}>
          Operated by <b>Blackcoffee Media</b> — six years, 250+ brands, 30+ specialists
          across India, running performance, creative and retention end to end.
        </p>
      </div>
    </section>
  );
}
