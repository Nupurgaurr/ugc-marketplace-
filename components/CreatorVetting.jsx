import Eyebrow from './ui/Eyebrow';
import sectionStyles from './sections.module.css';

const PIPELINE = ['Applied', 'In review', 'Approved', 'Live to brands'];

const POINTS = [
  {
    title: 'We watch the work',
    body: 'Review is about the videos you send and whether they fit the kind of campaigns brands run here. Follower count is not the test.',
  },
  {
    title: 'You can see where you stand',
    body: 'Your application moves through visible stages rather than disappearing into an inbox, and you hear back either way.',
  },
  {
    title: 'Not approved is not the end',
    body: 'If it is not a fit right now, that is about the current mix of brands. You are welcome to apply again with new work.',
  },
];

/** Section 7 — credible without being intimidating, and no invented turnaround times. */
export default function CreatorVetting() {
  return (
    <section className="section section--ruled" id="vetting">
      <div className="container">
        <Eyebrow>Review</Eyebrow>
        <h2 className="display" style={{ maxWidth: '18ch' }}>
          A person reviews it. <em>That cuts both ways.</em>
        </h2>

        <div className={sectionStyles.pipeline}>
          {PIPELINE.map((node, i) => (
            <span key={node} style={{ display: 'contents' }}>
              <span
                className={`${sectionStyles.node} ${
                  i === PIPELINE.length - 1 ? sectionStyles.nodeLive : ''
                }`}
              >
                {node}
              </span>
              {i < PIPELINE.length - 1 && (
                <span className={sectionStyles.nodeArrow} aria-hidden="true">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
        <p className="body-dim" style={{ fontSize: '0.94rem', maxWidth: '56ch' }}>
          The same review that keeps the network worth browsing is what makes a brand take
          your profile seriously when it does go live.
        </p>

        <div className={sectionStyles.trustGrid}>
          {POINTS.map((point) => (
            <div key={point.title}>
              <h3 className={sectionStyles.trustTitle}>{point.title}</h3>
              <p className={sectionStyles.trustBody}>{point.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
