'use client';

import { useState } from 'react';
import type { Creator } from '@/lib/types';
import SectionEyebrow from './SectionEyebrow';
import { useReveal } from '@/lib/animation/useReveal';
import styles from './discoverSections.module.css';

/** Lets a client flip the same four creators between the way every other
 *  marketplace shows them (profile list) and the way this one does
 *  (video-first) — rather than just claiming it's better. */
export default function WhyVideoFirst({ creators }: { creators: Creator[] }) {
  const [mode, setMode] = useState<'list' | 'grid'>('grid');
  const sample = creators.slice(0, 4);
  const ref = useReveal<HTMLDivElement>({ y: 16 });

  return (
    <section className="section section--ruled" id="why-video-first">
      <div className={`container ${styles.split}`} ref={ref}>
        <div>
          <SectionEyebrow>Why video-first</SectionEyebrow>
          <h2 className="display">
            A profile tells you nothing. <em>The clip tells you everything.</em>
          </h2>
          <p className="lede" style={{ marginTop: '1.4rem' }}>
            Most marketplaces make you open a profile to find out whether the work is any
            good — four clicks and four back-buttons to reject four creators. Flip the switch
            and see the difference.
          </p>
        </div>

        <div className={styles.demo}>
          <div className={styles.demoBar}>
            <div className={styles.toggle} role="group" aria-label="Browsing mode">
              <button
                type="button"
                className={`${styles.toggleBtn} ${mode === 'list' ? styles.toggleOn : ''}`}
                aria-pressed={mode === 'list'}
                onClick={() => setMode('list')}
              >
                Profile list
              </button>
              <button
                type="button"
                className={`${styles.toggleBtn} ${mode === 'grid' ? styles.toggleOn : ''}`}
                aria-pressed={mode === 'grid'}
                onClick={() => setMode('grid')}
              >
                Video-first
              </button>
            </div>
            <p className={styles.demoCost}>
              {mode === 'list' ? (
                <>
                  <b>4 profiles</b> to open before you see a single second of work
                </>
              ) : (
                <>
                  <b>0 clicks</b> — you have already seen all four
                </>
              )}
            </p>
          </div>

          <div className={styles.demoBody} key={mode}>
            {mode === 'list' ? (
              <div className={styles.rows}>
                {sample.map((creator) => (
                  <div className={styles.row} key={creator.id}>
                    <img className={styles.avatar} src={creator.preview.posterUrl} alt="" />
                    <div>
                      <p className={styles.rowName}>{creator.name}</p>
                      <p className={styles.rowMeta}>
                        {creator.category} · {creator.portfolio.length} videos
                      </p>
                    </div>
                    <span className={styles.rowLink}>View portfolio →</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.demoGrid}>
                {sample.map((creator) => (
                  <div className={styles.demoTile} key={creator.id}>
                    <video
                      src={creator.preview.previewUrl}
                      poster={creator.preview.posterUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      preload="none"
                    />
                    <span className={styles.demoTileLabel}>
                      {creator.name.split(' ')[0]} · {creator.contentStyles[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
