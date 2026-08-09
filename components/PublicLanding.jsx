'use client';

import { useCallback, useState } from 'react';
import Header from './Header';
import MarketplaceHero from './MarketplaceHero';
import MarketplaceChoice from './MarketplaceChoice';
import HowMarketplaceWorks from './HowMarketplaceWorks';
import CreatorPreview from './CreatorPreview';
import CuratedNetwork from './CuratedNetwork';
import PathwayColumns from './PathwayColumns';
import MarketplaceFinalCTA from './MarketplaceFinalCTA';
import Footer from './Footer';
import AuthGateModal from './AuthGateModal';

/**
 * Main public landing page — the front door of the marketplace. Its only job is
 * to explain what this is and route a visitor into the correct side.
 */
export default function PublicLanding({ creators }) {
  const [gate, setGate] = useState({ mode: null, context: '' });
  const openGate = useCallback((mode, context = '') => setGate({ mode, context }), []);
  const closeGate = useCallback(() => setGate({ mode: null, context: '' }), []);

  return (
    <>
      <Header variant="marketplace" onAuth={openGate} />
      <main>
        <MarketplaceHero />
        <MarketplaceChoice creators={creators} />
        <HowMarketplaceWorks />
        <CreatorPreview creators={creators} />
        <CuratedNetwork />
        <PathwayColumns />
        <MarketplaceFinalCTA />
      </main>
      <Footer />
      <AuthGateModal mode={gate.mode} context={gate.context} onClose={closeGate} />
    </>
  );
}
