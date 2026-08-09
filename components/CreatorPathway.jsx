import { ROUTES } from '@/lib/routes';
import styles from './marketplace.module.css';

/**
 * The creator side. One profile moving through review — the mirror image of the
 * brand panel, and an honest preview of what applying actually involves.
 */
const STAGES = [
  { label: 'Applied', state: 'done' },
  { label: 'In review by BCM', state: 'done' },
  { label: 'Approved', state: 'done' },
  { label: 'Live to brands', state: 'live' },
];

export default function CreatorPathway({ creator }) {
  return (
    <div className={styles.panel}>
      <p className={styles.panelEyebrow}>For creators</p>
      <h2 className={styles.panelTitle}>I am a creator</h2>
      <p className={styles.panelBody}>
        Apply with your work — short public form, no invite and no fee. Our team reviews
        every application, and once you&apos;re approved your portfolio goes live to brands
        already running campaigns with BCM.
      </p>

      <a className={styles.panelCta} href={ROUTES.becomeCreator}>
        Become a creator
        <span aria-hidden="true">→</span>
      </a>

      <div className={styles.panelVisual}>
        <div className={styles.profile}>
          <div className={styles.profileCard}>
            <img src={creator.preview.posterUrl} alt="" loading="lazy" />
          </div>
          <div className={styles.profileStages}>
            {STAGES.map((stage) => (
              <p
                key={stage.label}
                className={`${styles.stage} ${
                  stage.state === 'live' ? styles.stageLive : styles.stageDone
                }`}
              >
                <span className={styles.stageDot} aria-hidden="true" />
                {stage.label}
              </p>
            ))}
          </div>
        </div>
        <p className={styles.visualCaption}>Reviewed by a person, not a filter</p>
      </div>
    </div>
  );
}
