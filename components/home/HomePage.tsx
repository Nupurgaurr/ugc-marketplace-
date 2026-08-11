'use client';

import { useState } from 'react';
import type { Creator } from '@/lib/types';
import IntroOverlay from './IntroOverlay';
import Header from './Header';
import Hero from './Hero';
import HowItWorks from './HowItWorks';
import FeaturedStrip from './FeaturedStrip';
import WhyUs from './WhyUs';
import DualCTA from './DualCTA';
import Footer from './Footer';

export default function HomePage({ creators }: { creators: Creator[] }) {
  const [heroStart, setHeroStart] = useState(false);

  return (
    <>
      <IntroOverlay onComplete={() => setHeroStart(true)} />
      <Header />
      <main>
        <Hero start={heroStart} />
        <HowItWorks />
        <FeaturedStrip creators={creators} />
        <WhyUs />
        <DualCTA />
      </main>
      <Footer />
    </>
  );
}
