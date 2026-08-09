'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './hero.module.css';

/** Splits creators into n roughly equal columns. */
function toColumns(list, n) {
  const cols = Array.from({ length: n }, () => []);
  list.forEach((item, i) => cols[i % n].push(item));
  return cols;
}

/**
 * Hero visual: three slowly drifting columns of portfolio thumbnails with a
 * single live tile in front. Posters (not videos) do the volume work so only
 * one decoder runs here — the grid in `DiscoveryPreview` is where every tile
 * plays.
 */
export default function ReelWall({ creators }) {
  const columns = toColumns(creators, 3);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const featured = creators[index % creators.length];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    const play = video.play();
    if (play?.catch) play.catch(() => {});
  }, [index]);

  const advance = () => setIndex((i) => (i + 1) % creators.length);

  return (
    <div className={styles.stage}>
      <div className={styles.wall}>
        {columns.map((column, ci) => (
          <div
            key={ci}
            className={`${styles.column} ${ci % 2 === 1 ? styles.columnReverse : ''}`}
            style={{ '--drift-duration': `${42 + ci * 9}s` }}
          >
            {[...column, ...column].map((creator, i) => (
              <figure className={styles.plate} key={`${creator.id}-${i}`}>
                <img src={creator.preview.posterUrl} alt="" loading="lazy" />
                <figcaption className={styles.plateLabel}>{creator.category}</figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.featured}>
        <video
          ref={videoRef}
          className={styles.featuredVideo}
          src={featured.preview.previewUrl}
          poster={featured.preview.posterUrl}
          muted
          playsInline
          autoPlay
          preload="auto"
          onEnded={advance}
          onTimeUpdate={(e) => {
            const el = e.currentTarget;
            if (el.duration) setProgress((el.currentTime / el.duration) * 100);
          }}
        />
        <span className={styles.featuredFlag}>
          <span className={styles.dot} aria-hidden="true" />
          Portfolio
        </span>
        <div className={styles.featuredScrim}>
          <p className={styles.featuredName}>{featured.name}</p>
          <p className={styles.featuredMeta}>
            {featured.category} · {featured.city} · {featured.languages[0]}
          </p>
        </div>
        <span
          className={styles.progress}
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
