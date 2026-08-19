'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import MemeSlot from '@/components/shared/MemeSlot';
import ScrambleText from '@/components/motion/ScrambleText';
import MaskReveal from '@/components/motion/MaskReveal';
import MagneticButton from '@/components/motion/MagneticButton';
import DodgeButton from '@/components/motion/DodgeButton';
import { ROUTES } from '@/lib/routes';
import { cx } from '@/lib/utils';
import styles from './RoastStage.module.css';

export interface ScreenProps {
  active: boolean;
  reduced: boolean;
}

export function ScreenColdOpen({ active }: ScreenProps) {
  return (
    <div className={styles.screenInner}>
      <p className={styles.big}>
        <ScrambleText text="Ek minute." play={active} />
      </p>
      <p className={cx(styles.sub, styles.delayed, active && styles.delayedOn)} style={{ '--delay': '0.6s' } as CSSProperties}>
        Form neeche hai. Pehle baat kar lete hain.
      </p>
    </div>
  );
}

export function ScreenFirstCut({ active, reduced }: ScreenProps) {
  const [phase, setPhase] = useState<'first' | 'second'>('first');

  useEffect(() => {
    if (!active) {
      setPhase('first');
      return;
    }
    if (reduced) {
      setPhase('second');
      return;
    }
    const t = setTimeout(() => setPhase('second'), 1700);
    return () => clearTimeout(t);
  }, [active, reduced]);

  return (
    <div className={styles.screenInner}>
      {phase === 'first' ? (
        <p className={`${styles.big} ${styles.swapFade}`} key="first">
          You&rsquo;ve shot 200 reels.
        </p>
      ) : (
        <p className={`${styles.big} ${styles.swapFade}`} key="second">
          Total lifetime earnings: ₹0 and a protein bar.
        </p>
      )}
    </div>
  );
}

export function ScreenLine({ active }: ScreenProps) {
  return (
    <div className={styles.screenInner}>
      <MaskReveal className={styles.big}>
        <span>&ldquo;Collab karte hain.&rdquo;</span>
      </MaskReveal>
      <p className={cx(styles.sub, styles.delayed, active && styles.delayedOn)} style={{ '--delay': '0.5s' } as CSSProperties}>
        Translation: free mein karwa lenge.
      </p>
    </div>
  );
}

export function ScreenMemeA() {
  return (
    <div className={styles.screenInner}>
      <div className={styles.memeWrap}>
        <MemeSlot id="roast-04" caption="200 reels. Zero rent paid by 'exposure.'" />
      </div>
    </div>
  );
}

const QUIZ_OPTIONS = ['Zero', 'Ek-do', 'Bohot saare'] as const;
type QuizOption = (typeof QUIZ_OPTIONS)[number];

const QUIZ_ANSWERS: Record<QuizOption, string> = {
  Zero: 'Thought so. Not your fault. You’re pitching into a void.',
  'Ek-do': 'Two. Out of how many DMs?',
  'Bohot saare': 'Achha? Toh yahan kya kar rahe ho?',
};

export function ScreenQuestion({ active }: ScreenProps) {
  const [picked, setPicked] = useState<QuizOption | null>(null);

  useEffect(() => {
    if (!active) setPicked(null);
  }, [active]);

  return (
    <div className={styles.screenInner}>
      <p className={cx(styles.big, styles.bigMd)}>
        How many brands replied last month?
      </p>
      <div className={styles.quizOptions}>
        {QUIZ_OPTIONS.map((opt) => (
          <button
            key={opt}
            type="button"
            className={`${styles.quizOption} ${picked === opt ? styles.quizOptionOn : ''}`}
            onClick={() => setPicked(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <p className={styles.quizAnswer}>{picked ? QUIZ_ANSWERS[picked] : ''}</p>
    </div>
  );
}

export function ScreenTurn() {
  return (
    <div className={styles.screenInner}>
      <MaskReveal className={styles.big} direction="up">
        <span>Here&rsquo;s what nobody tells you.</span>
      </MaskReveal>
      <p className={styles.sub}>
        Brands aren&rsquo;t short of creators. They&rsquo;re short of creators who deliver on time.
      </p>
    </div>
  );
}

export function ScreenMemeB() {
  return (
    <div className={styles.screenInner}>
      <div className={styles.memeWrap}>
        <MemeSlot id="roast-07" caption="Turnaround time: also a personality trait." />
      </div>
    </div>
  );
}

const WHAT_LINES = ['Paid briefs from real brands.', 'We chase the invoice, not you.', 'Fifty-something people on it. Not four lakh.'];

export function ScreenWhatWeAre({ active }: ScreenProps) {
  return (
    <div className={styles.screenInner}>
      <p className={cx(styles.big, styles.bigSm)}>
        So we made a list.
      </p>
      <div className={styles.stack}>
        {WHAT_LINES.map((line, i) => (
          <p
            key={line}
            className={cx(styles.stackLine, styles.delayed, active && styles.delayedOn)}
            style={{ '--delay': `${0.3 + i * 0.2}s` } as CSSProperties}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export function ScreenBar() {
  return (
    <div className={styles.screenInner}>
      <MaskReveal className={styles.big} direction="up">
        <span>We reject most people who apply.</span>
      </MaskReveal>
      <p className={styles.sub}>
        A list everyone&rsquo;s on is worth nothing to the brands paying for it.
      </p>
    </div>
  );
}

export function ScreenAsk({ active }: ScreenProps) {
  const [haanHover, setHaanHover] = useState(false);
  const [nahiHover, setNahiHover] = useState(false);
  const [nahiSettled, setNahiSettled] = useState(false);

  useEffect(() => {
    if (!active) {
      setHaanHover(false);
      setNahiHover(false);
      setNahiSettled(false);
    }
  }, [active]);

  return (
    <div className={styles.screenInner}>
      <p className={cx(styles.big, styles.bigLg)}>
        Toh? Ready ho?
      </p>

      <div className={styles.askActions}>
        <div className={`${styles.askMemeBehind} ${haanHover ? styles.askMemeBehindOn : ''}`}>
          <MemeSlot id="roast-haan" caption="Main-character walk-in energy." />
        </div>

        <MagneticButton>
          <Link
            href={ROUTES.becomeCreatorApply}
            className={`${styles.askBtn} ${styles.haanBtn}`}
            onMouseEnter={() => setHaanHover(true)}
            onMouseLeave={() => setHaanHover(false)}
          >
            Haan
          </Link>
        </MagneticButton>

        <div className={`${styles.askMemeBehind} ${nahiHover ? styles.askMemeBehindOn : ''}`}>
          <MemeSlot id="roast-nahi" caption="Darr gayi? Its ok, apply when ready." />
        </div>

        {nahiSettled ? (
          <Link href={ROUTES.home} className={styles.askBtn}>
            Theek hai. Dobara aana jab tayyar ho.
          </Link>
        ) : (
          <DodgeButton
            className={styles.askBtn}
            onSettled={() => setNahiSettled(true)}
            onClick={() => setNahiHover((v) => !v)}
          >
            <span onMouseEnter={() => setNahiHover(true)} onMouseLeave={() => setNahiHover(false)}>
              Nahi
            </span>
          </DodgeButton>
        )}
      </div>
    </div>
  );
}
