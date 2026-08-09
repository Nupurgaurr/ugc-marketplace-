import styles from './ui.module.css';

/**
 * Duplicates its children once and translates -50%, so the loop is seamless.
 * Mirrors the scrolling service strip on the BCM homepage.
 */
export default function Marquee({ duration = 40, children, className = '' }) {
  return (
    <div className={`${styles.marquee} ${className}`} aria-hidden="true">
      <div className={styles.marqueeTrack} style={{ '--marquee-duration': `${duration}s` }}>
        {children}
        {children}
      </div>
    </div>
  );
}
