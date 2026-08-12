'use client';

import { useState } from 'react';
import type { Creator } from '@/lib/types';
import IntroOverlay from './IntroOverlay';
import Header from './Header';
import Hero from './Hero';
import WorkRail from './WorkRail';
import HowItWorksSequence from './HowItWorksSequence';
import Refusals from './Refusals';
import Split from './Split';
import Footer from './Footer';

export default function HomePage({ creators }: { creators: Creator[] }) {
  const [heroStart, setHeroStart] = useState(false);

  return (
    <>
      <IntroOverlay onComplete={() => setHeroStart(true)} />
      <Header />
      <main>
        <Hero start={heroStart} />
        <WorkRail creators={creators} />
        <HowItWorksSequence />
        <Refusals />
        <Split />
      </main>
      <Footer />
    </>
  );
}
