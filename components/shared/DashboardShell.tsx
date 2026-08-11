'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '@/lib/utils';
import styles from './DashboardShell.module.css';

export interface NavItem {
  label: string;
  href: string;
}

export default function DashboardShell({
  portalLabel,
  navItems,
  sessionName,
  sessionEmail,
  onLogout,
  pageTitle,
  pageSub,
  children,
}: {
  portalLabel: string;
  navItems: NavItem[];
  sessionName: string;
  sessionEmail: string;
  onLogout: () => void;
  pageTitle: string;
  pageSub?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.wordmark}>
            blackcoffee<span>.</span>
          </span>
          <span className={styles.portalLabel}>{portalLabel}</span>
        </div>

        <nav className={styles.nav} aria-label={`${portalLabel} navigation`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cx(styles.link, pathname === item.href && styles.linkActive)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.footer}>
          <p className={styles.session}>{sessionName}</p>
          <p className={styles.sessionEmail}>{sessionEmail}</p>
          <button type="button" className={styles.link} onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.pageHead}>
          <div>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
            {pageSub && <p className={styles.pageSub}>{pageSub}</p>}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
