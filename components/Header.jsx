'use client';

import { useEffect, useState } from 'react';
import Button from './ui/Button';
import { ROUTES } from '@/lib/routes';
import styles from './header.module.css';

/**
 * Two surfaces share this header. The marketplace entry page keeps both
 * pathways at identical weight; once a visitor is inside the client
 * experience, "Find a creator" becomes the single primary action.
 */
const VARIANTS = {
  marketplace: {
    nav: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Vetting', href: '#vetting' },
      { label: 'The work', href: '#preview' },
    ],
    actions: [
      { label: 'Find a creator', href: ROUTES.findCreator, variant: 'secondary' },
      { label: 'Become a creator', href: ROUTES.becomeCreator, variant: 'secondary' },
    ],
  },
  creator: {
    nav: [
      { label: 'Why join', href: '#why' },
      { label: 'How it works', href: '#journey' },
      { label: 'Your profile', href: '#profile' },
      { label: 'Questions', href: '#faq' },
    ],
    actions: [
      { label: 'Find a creator', href: ROUTES.findCreator, variant: 'secondary' },
      { label: 'Become a UGC partner', href: '#apply', variant: 'primary', arrow: true },
    ],
  },
  client: {
    nav: [
      { label: 'Browse creators', href: '#discover' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Post a brief', href: '#brief' },
      { label: 'Become a creator', href: ROUTES.becomeCreator },
    ],
    actions: [{ label: 'Find a creator', href: '#discover', variant: 'primary', arrow: true }],
  },
};

export default function Header({ variant = 'client', onAuth }) {
  const { nav, actions } = VARIANTS[variant] ?? VARIANTS.client;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.inner}`}>
        <a
          href={variant === 'marketplace' ? '#top' : ROUTES.home}
          className={styles.brand}
          aria-label="Blackcoffee Media UGC marketplace"
        >
          <span className={styles.wordmark}>
            blackcoffee<span>.</span>
          </span>
          <span className={styles.product}>UGC</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {nav.map((item) => (
            <a key={item.label} href={item.href} className={styles.link}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <Button variant="ghost" size="small" onClick={() => onAuth?.('login')}>
            Log in
          </Button>
          {actions.map((action) => (
            <Button
              key={action.label}
              as="a"
              href={action.href}
              variant={action.variant}
              size="small"
              arrow={action.arrow}
            >
              {action.label}
            </Button>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
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
          <nav className={styles.sheetNav} aria-label="Mobile">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={styles.sheetLink}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className={styles.sheetActions}>
            {actions.map((action) => (
              <Button
                key={action.label}
                as="a"
                href={action.href}
                variant={action.variant === 'primary' ? 'primary' : 'secondary'}
                block
                arrow
                onClick={() => setOpen(false)}
              >
                {action.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              block
              onClick={() => {
                setOpen(false);
                onAuth?.('login');
              }}
            >
              Log in
            </Button>
          </div>
          <div className={styles.sheetContact}>
            brew@blackcoffee.media
            <br />
            Mumbai · Vadodara
          </div>
        </div>
      )}
    </header>
  );
}
