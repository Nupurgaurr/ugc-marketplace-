'use client';

import type { Creator } from '@/lib/types';
import Eyebrow from '@/components/shared/Eyebrow';
import Button from '@/components/shared/Button';
import VideoPreviewCard from '@/components/shared/VideoPreviewCard';
import { useRevealGroup } from '@/lib/animation/useReveal';
import { ROUTES } from '@/lib/routes';
import styles from './sections.module.css';

export default function FeaturedStrip({ creators }: { creators: Creator[] }) {
  const groupRef = useRevealGroup<HTMLDivElement>(0.08);

  return (
    <section className="section section--ruled" id="creators">
      <div className="container">
        <div className={styles.head}>
          <div>
            <Eyebrow>The work</Eyebrow>
            <h2 className={`display ${styles.headTitle}`}>Hover. Judge for yourself.</h2>
          </div>
          <Button href={ROUTES.client.discover} variant="secondary" arrow>
            See all {creators.length}+ creators
          </Button>
        </div>

        <div className={styles.grid} ref={groupRef}>
          {creators.slice(0, 8).map((creator) => (
            <VideoPreviewCard creator={creator} key={creator.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
