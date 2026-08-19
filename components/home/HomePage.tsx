'use client';

import { useState } from 'react';
import IntroOverlay from './IntroOverlay';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';

export default function HomePage() {
  const [heroStart, setHeroStart] = useState(false);

  return (
    <>
      <IntroOverlay onComplete={() => setHeroStart(true)} />
      <Header />
      <main>
        <Hero start={heroStart} />
      </main>
      <Footer />
    </>
  );
}
