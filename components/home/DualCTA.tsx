'use client';

import Eyebrow from '@/components/shared/Eyebrow';
import Button from '@/components/shared/Button';
import { useReveal } from '@/lib/animation/useReveal';
import { ROUTES } from '@/lib/routes';
import styles from './sections.module.css';

export default function DualCTA() {
  const ref = useReveal<HTMLDivElement>({ y: 24 });

  return (
    <section className="section section--ruled">
      <div className="container">
        <Eyebrow>Get started</Eyebrow>
        <h2 className="display" style={{ marginTop: '0.7rem', maxWidth: '18ch' }}>
          Pick a side. Both take under five minutes.
        </h2>

        <div className={styles.choice} ref={ref} style={{ marginTop: '2.5rem' }}>
          <div className={styles.choiceCard}>
            <span className="eyebrow">For brands</span>
            <h3 className={styles.choiceTitle}>Find a creator</h3>
            <p className={styles.choiceBody}>
              Browse video-first, no account required. Shortlist and request when you&rsquo;re ready.
            </p>
            <Button href={ROUTES.client.discover} variant="primary" arrow>
              Browse creators
            </Button>
          </div>

          <div className={styles.choiceCard}>
            <span className="eyebrow">For creators</span>
            <h3 className={styles.choiceTitle}>Become a creator</h3>
            <p className={styles.choiceBody}>
              Two-minute application. A person reviews it. No invite required.
            </p>
            <Button href={ROUTES.creator.register} variant="secondary" arrow>
              Apply now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
