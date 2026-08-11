'use client';

import Eyebrow from '@/components/shared/Eyebrow';
import { useRevealGroup } from '@/lib/animation/useReveal';
import styles from './sections.module.css';

const PILLARS = [
  { title: 'Zero minimum to browse', body: 'No subscription, no monthly floor. Look before you commit to anything.' },
  { title: 'Video-first, always', body: 'See the work on hover. No digging through decks to judge a fit.' },
  { title: 'Every creator vetted', body: 'A person reviews each application. Quality over open scale.' },
  { title: 'Regional-language first', body: 'Built for India — Hindi, Tamil, Bengali and more, not an afterthought.' },
];

export default function WhyUs() {
  const groupRef = useRevealGroup<HTMLDivElement>(0.1);

  return (
    <section className="section section--ruled section--band" id="why-us">
      <div className="container">
        <div className={styles.head}>
          <div>
            <Eyebrow>Why us</Eyebrow>
            <h2 className={`display ${styles.headTitle}`}>What the others make you tolerate.</h2>
          </div>
        </div>

        <div className={styles.pillars} ref={groupRef}>
          {PILLARS.map((p) => (
            <div className={styles.pillar} key={p.title}>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarBody}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
