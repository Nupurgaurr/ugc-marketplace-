import Eyebrow from './ui/Eyebrow';
import styles from './marketplace.module.css';

/** The three participants from the report, in the order a campaign actually moves. */
const NODES = [
  {
    actor: 'Creator',
    title: 'Creators apply',
    body: 'A short public application with sample work. Anyone can apply — no invite, no fee.',
  },
  {
    actor: 'BCM',
    title: 'We review',
    body: 'Our team watches the work and checks the fit. Nothing goes live until it passes.',
  },
  {
    actor: 'Brand',
    title: 'Brands discover',
    body: 'Approved creators appear in a video-first grid. Watch, filter, shortlist, request.',
  },
  {
    actor: 'BCM',
    title: 'We coordinate',
    body: 'We confirm the match, brief the creator and stay on quality through delivery.',
  },
];

export default function HowMarketplaceWorks() {
  return (
    <section className="section section--ruled" id="how-it-works">
      <div className="container">
        <Eyebrow>How the marketplace works</Eyebrow>
        <h2 className="display" style={{ maxWidth: '20ch' }}>
          Two sides, <em>one team in the middle.</em>
        </h2>

        <ol className={styles.flow}>
          {NODES.map((node) => (
            <li className={styles.node} key={node.title}>
              <span
                className={`${styles.nodeActor} ${
                  node.actor === 'BCM' ? styles.nodeActorBcm : ''
                }`}
              >
                {node.actor}
              </span>
              <h3 className={styles.nodeTitle}>{node.title}</h3>
              <p className={styles.nodeBody}>{node.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
