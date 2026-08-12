'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { ROUTES } from '@/lib/routes';
import { cx } from '@/lib/utils';
import styles from './Header.module.css';

const NAV = [
  { label: 'The work', href: '/#work' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'What we don’t do', href: '/#refusals' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { session: clientSession } = useAuth('client');
  const { session: creatorSession } = useAuth('creator');
  const loggedIn = clientSession ?? creatorSession ?? null;
  const dashboardHref = clientSession ? ROUTES.client.dashboard : ROUTES.creator.dashboard;

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

        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          {loggedIn ? (
            <Button href={dashboardHref} variant="primary" size="small" arrow>
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="small" onClick={() => setLoginOpen((v) => !v)}>
                Log in
              </Button>
              <Button href={ROUTES.discover} variant="secondary" size="small">
                Find a creator
              </Button>
              <Button href={ROUTES.becomeCreator} variant="primary" size="small" arrow>
                Become a creator
              </Button>
            </>
          )}

          {loginOpen && !loggedIn && (
            <div className={styles.loginMenu} role="menu">
              <Link href={ROUTES.client.login} className={styles.loginMenuItem} onClick={() => setLoginOpen(false)}>
                Brand login
              </Link>
              <Link href={ROUTES.creator.login} className={styles.loginMenuItem} onClick={() => setLoginOpen(false)}>
                Creator login
              </Link>
            </div>
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
          {NAV.map((item) => (
            <Link key={item.label} href={item.href} className={styles.sheetLink} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className={styles.sheetActions}>
            <Button href={ROUTES.discover} variant="secondary" block onClick={() => setOpen(false)}>
              Find a creator
            </Button>
            <Button href={ROUTES.becomeCreator} variant="primary" block arrow onClick={() => setOpen(false)}>
              Become a creator
            </Button>
            <Button href={ROUTES.client.login} variant="ghost" block onClick={() => setOpen(false)}>
              Brand login
            </Button>
            <Button href={ROUTES.creator.login} variant="ghost" block onClick={() => setOpen(false)}>
              Creator login
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
