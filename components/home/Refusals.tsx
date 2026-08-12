'use client';

import Strikethrough from '@/components/motion/Strikethrough';
import { useReveal } from '@/lib/animation/useReveal';
import styles from './Refusals.module.css';

function Refusal({ before, struck, after }: { before: string; struck: string; after: string }) {
  const ref = useReveal<HTMLParagraphElement>({ y: 12, duration: 0.55 });
  return (
    <p className={`${styles.line} reveal`} ref={ref}>
      {before} <Strikethrough><strong>{struck}</strong></Strikethrough> {after}
    </p>
  );
}

export default function Refusals() {
  return (
    <section className="section section--ruled section--band" id="refusals">
      <div className="container">
        <h2 className={`display ${styles.title}`}>What we don&rsquo;t do.</h2>
        <div className={styles.list}>
          <Refusal before="No" struck="subscription" after="to look at a list." />
          <Refusal before="No" struck="profile pages" after="you have to click into to see the work." />
          <Refusal before="No one gets on the list just because they" struck="applied" after="." />
          <Refusal before="No treating Hindi, Tamil or Marathi as" struck="a filter we added later" after="." />
        </div>
      </div>
    </section>
  );
}
