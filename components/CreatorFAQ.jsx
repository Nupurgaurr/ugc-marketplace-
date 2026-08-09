'use client';

import { useState } from 'react';
import Eyebrow from './ui/Eyebrow';
import styles from './creator.module.css';

/**
 * Only answers the report actually supports. Where it is silent — review times,
 * payment terms, exclusivity — the copy stays general rather than inventing a
 * policy.
 */
const ITEMS = [
  {
    q: 'Who can apply?',
    a: 'Anyone making short-form video content. The application is public — no invite, no referral, and no follower minimum. What gets looked at is the work you link to.',
  },
  {
    q: 'Does it cost anything to apply?',
    a: 'No. Applying and being listed are free.',
  },
  {
    q: 'How long does review take?',
    a: 'Applications are read by a person rather than screened automatically, so it is not instant. Your application shows its stage as it moves, and you get a decision either way.',
  },
  {
    q: 'What do I need to have ready?',
    a: 'Your name and contact, city, content niche, the languages you shoot in, your social handles, and one to three links to sample content. That is the whole first step.',
  },
  {
    q: 'What happens once I am approved?',
    a: 'You build your profile and upload portfolio videos. That profile is what brands browse — bio, categories and content styles, languages, location, availability and an optional rate range sit alongside the video grid.',
  },
  {
    q: 'Does being approved mean I get work?',
    a: 'No. Approval makes you discoverable. Brands browsing the network and our own team both decide who to request, and requests depend on what campaigns are live at the time.',
  },
  {
    q: 'Do I set my own rate?',
    a: 'The profile carries an optional rate or budget range. It is a starting point for the conversation — the final scope and rate are confirmed with BCM before anything is committed.',
  },
  {
    q: 'How do brands contact me?',
    a: 'Through the platform. A request arrives with the brand, the campaign and the content requirement attached, and our team coordinates from there.',
  },
];

export default function CreatorFAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section section--ruled" id="faq">
      <div className="container">
        <Eyebrow>Questions</Eyebrow>
        <h2 className="display" style={{ maxWidth: '16ch' }}>
          Before you apply.
        </h2>

        <div className={styles.faq}>
          {ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ''}`} key={item.q}>
                <button
                  type="button"
                  className={styles.faqQ}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  {item.q}
                  <span className={styles.faqSign} aria-hidden="true">
                    +
                  </span>
                </button>
                {isOpen && <p className={styles.faqA}>{item.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
