'use client';

import { useCallback, useState } from 'react';
import IntroOverlay from './IntroOverlay';
import Header from './Header';
import ComingSoon from './ComingSoon';
import Footer from './Footer';

export default function HomePage() {
  const [entranceDone, setEntranceDone] = useState(false);
  const onComplete = useCallback(() => setEntranceDone(true), []);

  return (
    <>
      <IntroOverlay onComplete={onComplete} />
      <Header />
      <main>
        <ComingSoon start={entranceDone} />
      </main>
      <Footer />
    </>
  );
}
