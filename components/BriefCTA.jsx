'use client';

import { useState } from 'react';
import Button from './ui/Button';
import Eyebrow from './ui/Eyebrow';
import styles from './brief.module.css';

const DELIVERABLES = [
  'Product demo',
  'Testimonial',
  'Unboxing',
  'GRWM',
  'Explainer',
  'Ad creative',
];

const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Marathi', 'Telugu', 'Bengali'];

const POINTS = [
  'A BCM strategist reads the brief — not a matching algorithm.',
  'You get a shortlist back with the work attached, so you still choose.',
  'Existing BCM clients skip the queue on the same concierge lane.',
];

/**
 * The second client pathway from the report: describe a need instead of
 * browsing, and let the admin team suggest matches. Submitting is the same
 * account gate as requesting a creator.
 */
export default function BriefCTA({ onAuth }) {
  const [deliverables, setDeliverables] = useState(['Testimonial']);
  const [languages, setLanguages] = useState(['Hindi']);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  return (
    <section className="section section--ruled" id="brief">
      <div className={`container ${styles.wrap}`}>
        <div>
          <Eyebrow>Post a brief</Eyebrow>
          <h2 className="display" style={{ maxWidth: '14ch' }}>
            Skip the browsing. <em>Tell us what you need.</em>
          </h2>
          <p className="lede" style={{ marginTop: '1.4rem' }}>
            Some campaigns are easier to describe than to search for. Send the brief and
            we&apos;ll come back with creators who fit — the same white-glove lane our agency
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
            <label className={styles.label} htmlFor="brief-brand">
              Brand or website
            </label>
            <input
              id="brief-brand"
              className={styles.input}
              type="text"
              placeholder="e.g. yourbrand.in"
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>What do you need?</span>
            <div className={styles.chips}>
              {DELIVERABLES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={deliverables.includes(item)}
                  className={`${styles.chip} ${deliverables.includes(item) ? styles.chipOn : ''}`}
                  onClick={() => toggle(deliverables, setDeliverables, item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Language</span>
            <div className={styles.chips}>
              {LANGUAGES.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={languages.includes(item)}
                  className={`${styles.chip} ${languages.includes(item) ? styles.chipOn : ''}`}
                  onClick={() => toggle(languages, setLanguages, item)}
                >
                  {item}
                </button>
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

          <Button
            variant="primary"
            block
            arrow
            className={styles.submit}
            onClick={() => onAuth('request', 'Sending your brief to the BCM team.')}
          >
            Post a brief
          </Button>

          <p className={styles.disclaimer}>
            Prototype — the form is interactive but nothing is submitted. In production this
            creates a brief record that lands in the admin matching queue.
          </p>
        </div>
      </div>
    </section>
  );
}
