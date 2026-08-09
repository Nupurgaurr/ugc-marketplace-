'use client';

import { useState } from 'react';
import Button from './ui/Button';
import Eyebrow from './ui/Eyebrow';
import styles from './brief.module.css';
import modal from './ui/modal.module.css';

/**
 * The public application from the report — deliberately short. Reuses the same
 * form styling as the client-side "post a brief" card so both sides of the
 * marketplace fill in forms that look and behave identically.
 */
const NICHES = [
  'Beauty & Skincare',
  'Food & Beverage',
  'Fashion & Apparel',
  'Tech & Gadgets',
  'Fitness & Wellness',
  'Home & Kitchen',
  'Baby & Parenting',
  'Travel',
  'Pet Care',
  'Finance & Apps',
];

const LANGUAGES = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Marathi',
  'Bengali',
  'Gujarati',
  'Malayalam',
  'Punjabi',
  'Kannada',
];

const POINTS = [
  'Takes about two minutes — no portfolio upload at this stage.',
  'One to three links to work you have already made is enough.',
  'A BCM reviewer watches them and comes back to you either way.',
];

export default function ApplicationForm() {
  const [niches, setNiches] = useState(['Beauty & Skincare']);
  const [languages, setLanguages] = useState(['Hindi', 'English']);
  const [sent, setSent] = useState(false);

  const toggle = (list, setList, value) =>
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  return (
    <section className="section section--ruled" id="apply">
      <div className={`container ${styles.wrap}`}>
        <div>
          <Eyebrow>Application</Eyebrow>
          <h2 className="display" style={{ maxWidth: '13ch' }}>
            Send your work. <em>That is the whole first step.</em>
          </h2>
          <p className="lede" style={{ marginTop: '1.4rem' }}>
            No showreel, no deck, no pitch. Tell us where you are, what you shoot and in
            which languages, and link a few things you have already posted.
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
            <span className={styles.cardTitle}>Become a UGC partner</span>
            <span className={styles.cardStamp}>~2 min</span>
          </div>

          <div className={`${styles.field} ${styles.duo}`}>
            <div>
              <label className={styles.label} htmlFor="ap-name">
                Full name
              </label>
              <input id="ap-name" className={styles.input} type="text" placeholder="Your name" />
            </div>
            <div>
              <label className={styles.label} htmlFor="ap-city">
                City
              </label>
              <input id="ap-city" className={styles.input} type="text" placeholder="e.g. Mumbai" />
            </div>
          </div>

          <div className={`${styles.field} ${styles.duo}`}>
            <div>
              <label className={styles.label} htmlFor="ap-email">
                Email
              </label>
              <input
                id="ap-email"
                className={styles.input}
                type="email"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className={styles.label} htmlFor="ap-phone">
                Phone / WhatsApp
              </label>
              <input id="ap-phone" className={styles.input} type="tel" placeholder="+91" />
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Content niche</span>
            <div className={styles.chips}>
              {NICHES.map((niche) => (
                <button
                  key={niche}
                  type="button"
                  aria-pressed={niches.includes(niche)}
                  className={`${styles.chip} ${niches.includes(niche) ? styles.chipOn : ''}`}
                  onClick={() => toggle(niches, setNiches, niche)}
                >
                  {niche}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <span className={styles.label}>Languages you shoot in</span>
            <div className={styles.chips}>
              {LANGUAGES.map((language) => (
                <button
                  key={language}
                  type="button"
                  aria-pressed={languages.includes(language)}
                  className={`${styles.chip} ${
                    languages.includes(language) ? styles.chipOn : ''
                  }`}
                  onClick={() => toggle(languages, setLanguages, language)}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ap-handles">
              Instagram / YouTube / TikTok handles
            </label>
            <input
              id="ap-handles"
              className={styles.input}
              type="text"
              placeholder="@yourhandle"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ap-links">
              Sample content links (1–3)
            </label>
            <input
              id="ap-links"
              className={styles.input}
              type="text"
              placeholder="Paste links, separated by commas"
            />
          </div>

          <Button
            variant="primary"
            block
            arrow
            className={styles.submit}
            onClick={() => setSent(true)}
          >
            Submit application
          </Button>

          <p className={styles.disclaimer}>
            Prototype — the form is interactive but nothing is submitted. In production this
            creates a pending creator record that the admin approval queue picks up.
          </p>
        </div>
      </div>

      {sent && (
        <div className={modal.overlay} onClick={() => setSent(false)} role="presentation">
          <div
            className={modal.modal}
            role="dialog"
            aria-modal="true"
            aria-label="Application received"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={modal.close}
              onClick={() => setSent(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <h2 className={modal.modalTitle}>That is it — you are in review.</h2>
            <p className={modal.modalBody}>
              Your application would now sit in the BCM review queue at the &quot;In
              review&quot; stage. You would be able to check that status any time, and
              you would hear back either way.
            </p>
            <div className={modal.modalActions}>
              <Button variant="primary" block onClick={() => setSent(false)}>
                Done
              </Button>
            </div>
            <p className={modal.modalNote}>
              Prototype — no application was created and nothing was sent.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
