'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import LetterField from '@/components/motion/LetterField';
import MemeSlot from './MemeSlot';
import { signOut } from '@/app/actions/auth';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import styles from './PendingStage.module.css';

const WORD_SEQUENCE = ['WAITING', 'STILL WAITING', 'SERIOUSLY, GO OUTSIDE'];
const IDLE_MS = 10000;

/** The most boring moment in the product, made into a toy. Rendered instead
 *  of the real dashboard while a an application is still pending,
 *  no sidebar, no fake dashboard behind it. */
export default function PendingStage({ submittedAt }: { submittedAt: string }) {
  const [wordIndex, setWordIndex] = useState(0);
  const lastInteraction = useRef(Date.now());

  useEffect(() => {
    const bump = () => {
      lastInteraction.current = Date.now();
    };
    window.addEventListener('pointermove', bump);
    window.addEventListener('pointerdown', bump);

    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current > IDLE_MS) {
        setWordIndex((i) => Math.min(i + 1, WORD_SEQUENCE.length - 1));
        lastInteraction.current = Date.now();
      }
    }, 1000);

    return () => {
      window.removeEventListener('pointermove', bump);
      window.removeEventListener('pointerdown', bump);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles.stage}>
      <div className={styles.top}>
        <Link href={ROUTES.home} className={styles.brand}>
          blackcoffee<span>.</span>
        </Link>
        <form action={signOut}>
          <button type="submit" className={styles.logout}>
            Log out
          </button>
        </form>
      </div>

      <div className={styles.head}>
        <p className={styles.big}>Under review.</p>
        <p className={styles.sub}>A human is actually looking at it. Usually 48 hours.</p>
      </div>

      <div className={styles.toy}>
        <LetterField key={wordIndex} word={WORD_SEQUENCE[wordIndex]} />
        <div className={styles.corner}>
          <MemeSlot id="pending-01" caption="Still here?" />
        </div>
      </div>

      <div className={styles.footer}>Submitted {formatDate(submittedAt)}, we&rsquo;ll email you the moment a human decides.</div>
    </div>
  );
}
