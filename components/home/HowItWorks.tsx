'use client';

import Eyebrow from '@/components/shared/Eyebrow';
import { useRevealGroup } from '@/lib/animation/useReveal';
import styles from './sections.module.css';

const STEPS = [
  {
    title: 'Register or post a need',
    body: 'Brands sign up free and browse instantly. Creators apply in under two minutes.',
  },
  {
    title: 'We match or you shortlist',
    body: 'Browse the video-first grid yourself, or tell us the brief and we suggest who fits.',
  },
  {
    title: 'Approve and collaborate',
    body: 'We coordinate the request, the creator delivers, you review. We stay in the loop throughout.',
  },
];

export default function HowItWorks() {
  const groupRef = useRevealGroup<HTMLDivElement>(0.12);

  return (
    <section className="section section--ruled" id="how-it-works">
      <div className="container">
        <div className={styles.head}>
          <div>
            <Eyebrow>How it works</Eyebrow>
            <h2 className={`display ${styles.headTitle}`}>Three steps. No noise.</h2>
          </div>
        </div>

        <div className={styles.steps} ref={groupRef}>
          {STEPS.map((step, i) => (
            <div className={styles.step} key={step.title}>
              <span className={styles.stepIndex}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepBody}>{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
