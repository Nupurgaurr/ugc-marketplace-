'use client';

import Eyebrow from './ui/Eyebrow';
import CreatorCard from './CreatorCard';
import styles from './creator.module.css';

/**
 * Literally the client-side card component in read-only mode. Showing creators
 * the real thing — rather than a mock-up of it — is the honest way to explain
 * how they will be seen.
 */
export default function ClientViewPreview({ creators }) {
  return (
    <section className="section section--ruled section--band" id="how-you-appear">
      <div className="container">
        <Eyebrow>How brands see you</Eyebrow>
        <h2 className="display" style={{ maxWidth: '19ch' }}>
          This is your tile <em>in the brand-facing grid.</em>
        </h2>

        <div className={styles.clientView}>
          {creators.slice(0, 4).map((creator) => (
            <CreatorCard key={creator.id} creator={creator} readOnly />
          ))}
        </div>

        <p className={styles.viewNote}>
          Name, category, lead content style, languages, city and your rate range —
          everything a brand needs to decide, on top of a video that is already playing.
          No view counts, no engagement scores, no leaderboard.
        </p>
      </div>
    </section>
  );
}
