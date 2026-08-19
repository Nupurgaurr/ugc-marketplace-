import type { ReactNode } from 'react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import styles from './AuthPageShell.module.css';

export default function AuthPageShell({
  title,
  footer,
  children,
}: {
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
          <h1 className={`display ${styles.title}`}>
            {title}
          </h1>
          {children}
          {footer && <div className={styles.foot}>{footer}</div>}
        </div>
      </div>
    </div>
  );
}
