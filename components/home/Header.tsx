'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { cx } from '@/lib/utils';
import styles from './Header.module.css';

/** Logo left, hamburger right, at every breakpoint. It never becomes a
 *  horizontal nav. The menu holds two destinations and that is the whole
 *  navigation surface of the product. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled)}>
      <div className={cx('container', styles.inner)}>
        <Link href={ROUTES.home} className={styles.brand} aria-label="blackcoffee UGC, home">
          <span className={styles.wordmark}>
            blackcoffee<span>.</span>
          </span>
          <span className={styles.product}>UGC</span>
        </Link>

        <button
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className={styles.sheet} id="site-menu">
          <Link href={ROUTES.becomeCreator} className={styles.sheetLink} onClick={() => setOpen(false)}>
            Become a creator
          </Link>
          <Link href={ROUTES.admin.login} className={styles.sheetLink} onClick={() => setOpen(false)}>
            Admin login
          </Link>
        </div>
      )}
    </header>
  );
}
