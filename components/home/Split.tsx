import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import styles from './Split.module.css';

export default function Split() {
  return (
    <section className="section--ruled">
      <div className={styles.split}>
        <Link href={ROUTES.discover} className={styles.half}>
          <span className={styles.label}>I need creators</span>
        </Link>
        <Link href={ROUTES.becomeCreator} className={styles.half}>
          <span className={styles.label}>I am a creator</span>
        </Link>
      </div>
    </section>
  );
}
