import Eyebrow from './ui/Eyebrow';
import styles from './creator.module.css';

/** The creator lane from the report, end to end, with the hand-offs labelled. */
const LEGS = [
  {
    index: '01',
    actor: 'You',
    title: 'Apply',
    body: 'A short public form — name, contact, city, niche, languages, handles and a few sample links.',
  },
  {
    index: '02',
    actor: 'BCM',
    title: 'Get approved',
    body: 'Our team watches your samples and checks fit. You can see where your application stands the whole time.',
  },
  {
    index: '03',
    actor: 'You',
    title: 'Build your profile',
    body: 'Bio, categories and content styles, languages, location, availability and an optional rate range.',
  },
  {
    index: '04',
    actor: 'You',
    title: 'Upload your work',
    body: 'Portfolio videos are the core of the profile. Thumbnails and previews are generated for you on upload.',
  },
  {
    index: '05',
    actor: 'Brand',
    title: 'Get discovered',
    body: 'You appear in the browsing grid, where brands filter by category, style, language, city and rate.',
  },
  {
    index: '06',
    actor: 'You',
    title: 'Receive requests',
    body: 'Requests arrive with the brand, campaign and requirement attached. Accept, deliver, and BCM oversees quality.',
  },
];

export default function CreatorJourney() {
  return (
    <section className="section section--ruled" id="journey">
      <div className="container">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="display" style={{ maxWidth: '18ch' }}>
          Six steps. <em>One of them is ours.</em>
        </h2>

        <ol className={styles.journey}>
          {LEGS.map((leg) => (
            <li className={styles.leg} key={leg.index}>
              <div className={styles.legTop}>
                <span className={styles.legIndex}>{leg.index}</span>
                <span
                  className={`${styles.legActor} ${
                    leg.actor === 'BCM' ? styles.legActorBcm : ''
                  }`}
                >
                  {leg.actor}
                </span>
              </div>
              <h3 className={styles.legTitle}>{leg.title}</h3>
              <p className={styles.legBody}>{leg.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
