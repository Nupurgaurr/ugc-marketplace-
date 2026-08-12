'use client';

import type { Creator } from '@/lib/types';
import Link from 'next/link';
import DragRail from '@/components/motion/DragRail';
import VideoPreviewCard from '@/components/shared/VideoPreviewCard';
import { useReveal } from '@/lib/animation/useReveal';
import { ROUTES } from '@/lib/routes';
import styles from './WorkRail.module.css';

export default function WorkRail({ creators }: { creators: Creator[] }) {
  const headRef = useReveal<HTMLDivElement>({ y: 16 });

  return (
    <section className="section section--ruled" id="work">
      <div className="container">
        <div className={styles.head} ref={headRef}>
          <h2 className={`display ${styles.title}`}>Everything here shipped.</h2>
          <Link href={ROUTES.discover} className={styles.link}>
            See all {creators.length}+ creators →
          </Link>
        </div>

        <DragRail>
          {creators.map((creator) => (
            <div className={styles.card} key={creator.id}>
              <VideoPreviewCard creator={creator} />
            </div>
          ))}
        </DragRail>
      </div>
    </section>
  );
}
