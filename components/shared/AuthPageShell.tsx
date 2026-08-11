import type { ReactNode } from 'react';
import Link from 'next/link';
import Eyebrow from './Eyebrow';
import { ROUTES } from '@/lib/routes';
import styles from './AuthPageShell.module.css';

export default function AuthPageShell({
  eyebrow,
  title,
  footer,
  children,
}: {
  eyebrow: string;
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <Link href={ROUTES.home} className={styles.brand}>
          blackcoffee<span>.</span>
        </Link>
      </div>
      <div className={styles.body}>
        <div className={`container ${styles.inner}`}>
          <p className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
          <h1 className={`display ${styles.title}`} style={{ textAlign: 'center' }}>
            {title}
          </h1>
          {children}
          {footer && <div className={styles.foot}>{footer}</div>}
        </div>
      </div>
    </div>
  );
}
