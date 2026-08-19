import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.top}`}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>
            blackcoffee<span>.</span> UGC
          </span>
          <p className={styles.tagline}>We reject most people who apply. That&rsquo;s the point.</p>
        </div>

        <div className={styles.columns}>
          <div>
            <p className={styles.colTitle}>Creators</p>
            <Link href={ROUTES.becomeCreator} className={styles.colLink}>
              Become a partner
            </Link>
            <Link href={ROUTES.creator.login} className={styles.colLink}>
              Log in
            </Link>
          </div>
          <div>
            <p className={styles.colTitle}>Contact</p>
            <span className={styles.colLink}>brew@blackcoffee.media</span>
            <span className={styles.colLink}>Mumbai · Vadodara</span>
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <span>© {new Date().getFullYear()} blackcoffee. media</span>
        <span>Built to be the standard, not another option.</span>
      </div>
    </footer>
  );
}
