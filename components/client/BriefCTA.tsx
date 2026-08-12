'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Chip } from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import SectionEyebrow from './SectionEyebrow';
import { useReveal } from '@/lib/animation/useReveal';
import { CONTENT_STYLES, LANGUAGES } from '@/lib/data/creators';
import { ROUTES } from '@/lib/routes';
import styles from './BriefCTA.module.css';

const POINTS = [
  'A BCM strategist reads the brief — not a matching algorithm.',
  'You get a shortlist back with the work attached, so you still choose.',
  'Existing BCM clients skip the queue on the same concierge lane.',
];

/** A taste of the real brief form — picks here carry over once you land on
 *  the actual (authenticated) form at /client/briefs/new. */
export default function BriefCTA() {
  const router = useRouter();
  const [deliverables, setDeliverables] = useState<string[]>(['Testimonial']);
  const [languages, setLanguages] = useState<string[]>(['Hindi']);
  const ref = useReveal<HTMLDivElement>({ y: 16 });

  const toggle = (list: string[], setList: (v: string[]) => void, value: string) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  return (
    <section className="section section--ruled" id="brief">
      <div className={`container ${styles.wrap}`} ref={ref}>
        <div>
          <SectionEyebrow>Post a brief</SectionEyebrow>
          <h2 className="display" style={{ maxWidth: '14ch' }}>
            Skip the browsing. <em>Tell us what you need.</em>
          </h2>
          <p className="lede" style={{ marginTop: '1.4rem' }}>
            Some campaigns are easier to describe than to search for. Send the brief and
            we&rsquo;ll come back with creators who fit — the same white-glove lane our agency
            clients already use.
          </p>

          <ul className={styles.points}>
            {POINTS.map((point) => (
              <li className={styles.point} key={point}>
                <span className={styles.pointMark} aria-hidden="true">
                  ▸
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>Campaign brief</span>
            <span className={styles.cardStamp}>Takes ~2 min</span>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>What do you need?</span>
            <div className={styles.chips}>
              {CONTENT_STYLES.slice(0, 6).map((item) => (
                <Chip key={item} active={deliverables.includes(item)} onClick={() => toggle(deliverables, setDeliverables, item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Language</span>
            <div className={styles.chips}>
              {LANGUAGES.slice(0, 6).map((item) => (
                <Chip key={item} active={languages.includes(item)} onClick={() => toggle(languages, setLanguages, item)}>
                  {item}
                </Chip>
              ))}
            </div>
          </div>

          <div className={`${styles.field} ${styles.duo}`}>
            <div>
              <label className={styles.label} htmlFor="brief-budget">
                Budget per video
              </label>
              <select id="brief-budget" className={styles.select} defaultValue="10-20">
                <option value="under-10">Under ₹10k</option>
                <option value="10-20">₹10k – ₹20k</option>
                <option value="over-20">₹20k +</option>
                <option value="unsure">Not sure yet</option>
              </select>
            </div>
            <div>
              <label className={styles.label} htmlFor="brief-when">
                Needed by
              </label>
              <select id="brief-when" className={styles.select} defaultValue="2-weeks">
                <option value="1-week">Within a week</option>
                <option value="2-weeks">2 – 3 weeks</option>
                <option value="month">This month</option>
                <option value="planning">Just planning</option>
              </select>
            </div>
          </div>

          <Button variant="primary" block arrow onClick={() => router.push(ROUTES.client.briefNew)}>
            Post a brief
          </Button>

          <p className={styles.disclaimer}>
            Log in (or register) to submit — we carry these picks over to the real form.
          </p>
        </div>
      </div>
    </section>
  );
}
