import Eyebrow from './ui/Eyebrow';
import styles from './sections.module.css';

const PIPELINE = ['Applied', 'In review', 'Approved', 'Live in the grid'];

/** Section 6 — short by design. The point is the difference from an open directory. */
export default function CuratedNetwork() {
  return (
    <section className="section section--ruled section--band" id="vetting">
      <div className="container">
        <Eyebrow>Curated network</Eyebrow>
        <h2 className="display" style={{ maxWidth: '18ch' }}>
          Not a directory. <em>A network we stand behind.</em>
        </h2>

        <div className={styles.pipeline}>
          {PIPELINE.map((node, i) => (
            <span key={node} style={{ display: 'contents' }}>
              <span
                className={`${styles.node} ${i === PIPELINE.length - 1 ? styles.nodeLive : ''}`}
              >
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

        <p className="body-dim" style={{ fontSize: '0.94rem', maxWidth: '56ch' }}>
          Every application is watched by a BCM reviewer before it becomes visible, and new
          brand accounts pass a light check before a request reaches anyone. Both sides are
          vetted, so neither side is dealing with strangers.
        </p>

        <p className={styles.credit}>
          Operated by <b>Blackcoffee Media</b> — six years, 250+ brands, 30+ specialists
          across India, running performance, creative and retention end to end.
        </p>
      </div>
    </section>
  );
}
