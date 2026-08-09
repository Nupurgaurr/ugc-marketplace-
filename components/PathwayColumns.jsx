import Button from './ui/Button';
import Eyebrow from './ui/Eyebrow';
import { ROUTES } from '@/lib/routes';
import styles from './marketplace.module.css';

/**
 * Section 7 reinforces both sides without repeating the panels — it answers the
 * next question ("what do I actually get?") rather than restating the choice.
 */
const LANES = [
  {
    head: 'For brands',
    items: [
      'Browse and filter without an account',
      'Watch portfolio work before you commit to anyone',
      'Shortlist across a session, request in one click',
      'Or post a brief and let our team shortlist for you',
    ],
    cta: { label: 'Find a creator', href: ROUTES.findCreator },
  },
  {
    head: 'For creators',
    items: [
      'One short public application, reviewed by a person',
      'A profile where the portfolio grid is the profile',
      'Requests from brands already spending with BCM',
      'Status you can see: applied, in review, approved, live',
    ],
    cta: { label: 'Become a creator', href: ROUTES.becomeCreator },
  },
];

export default function PathwayColumns() {
  return (
    <section className="section section--ruled">
      <div className="container">
        <Eyebrow>What each side gets</Eyebrow>
        <h2 className="display" style={{ maxWidth: '17ch', marginBottom: '2.5rem' }}>
          Built for both, <em>not one bolted onto the other.</em>
        </h2>

        <div className={styles.lanes}>
          {LANES.map((lane) => (
            <div className={styles.lane} key={lane.head}>
              <p className={styles.laneHead}>{lane.head}</p>
              <ul className={styles.laneList}>
                {lane.items.map((item) => (
                  <li className={styles.laneItem} key={item}>
                    <span className={styles.laneMark} aria-hidden="true">
                      ▸
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Button as="a" href={lane.cta.href} variant="secondary" arrow>
                {lane.cta.label}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
