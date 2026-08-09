import Eyebrow from './ui/Eyebrow';
import styles from './sections.module.css';

/** The client lane of the report's end-to-end flow, with the hand-off to BCM made explicit. */
const STEPS = [
  {
    index: '01',
    lane: 'You',
    title: 'Discover',
    body: 'Open the grid and start watching. No account, no minimum spend, no sales call first.',
  },
  {
    index: '02',
    lane: 'You',
    title: 'Filter',
    body: 'Narrow by category, content style, language, city and rate until the grid is only people you would actually hire.',
  },
  {
    index: '03',
    lane: 'You',
    title: 'Shortlist or request',
    body: 'Save the ones worth a second look, then send the shortlist across. This is the point an account is needed.',
  },
  {
    index: '04',
    lane: 'BCM',
    title: 'We coordinate',
    body: 'We confirm availability and rate, brief the creator, and stay on the campaign through delivery and revisions.',
  },
];

export default function HowItWorks() {
  return (
    <section className="section section--ruled" id="how-it-works">
      <div className="container">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="display" style={{ maxWidth: '18ch', marginBottom: '3rem' }}>
          Four steps. <em>You do three of them.</em>
        </h2>

        <ol className={styles.steps}>
          {STEPS.map((step) => (
            <li className={styles.step} key={step.index}>
              <span className={styles.stepIndex}>{step.index}</span>
              <span
                className={`${styles.stepLane} ${step.lane === 'BCM' ? styles.stepLaneBcm : ''}`}
              >
                {step.lane}
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
