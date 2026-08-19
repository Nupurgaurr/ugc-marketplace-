'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { ROUTES } from '@/lib/routes';
import { cx } from '@/lib/utils';
import styles from './Header.module.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { session: creatorSession } = useAuth('creator');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled)}>
      <div className={cx('container', styles.inner)}>
        <Link href={ROUTES.home} className={styles.brand} aria-label="blackcoffee UGC marketplace">
          <span className={styles.wordmark}>
            blackcoffee<span>.</span>
          </span>
          <span className={styles.product}>UGC</span>
        </Link>

        <div className={styles.actions}>
          {creatorSession ? (
            <Button href={ROUTES.creator.dashboard} variant="primary" size="small" arrow>
              Dashboard
            </Button>
          ) : (
            <Button href={ROUTES.becomeCreator} variant="primary" size="small" arrow>
              Become a creator
            </Button>
          )}
        </div>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className={styles.sheet}>
          <div className={styles.sheetActions}>
            <Button href={ROUTES.becomeCreator} variant="primary" block arrow onClick={() => setOpen(false)}>
              Become a creator
            </Button>
            <Button href={ROUTES.admin.login} variant="ghost" block onClick={() => setOpen(false)}>
              Admin login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
