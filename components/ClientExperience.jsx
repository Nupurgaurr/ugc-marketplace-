'use client';

import { useCallback, useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import DiscoveryPreview from './DiscoveryPreview';
import WhyVideoFirst from './WhyVideoFirst';
import HowItWorks from './HowItWorks';
import BriefCTA from './BriefCTA';
import TrustSection from './TrustSection';
import RegionalSection from './RegionalSection';
import FinalCTA from './FinalCTA';
import CreatorLane from './CreatorLane';
import Footer from './Footer';
import AuthGateModal from './AuthGateModal';

/**
 * Owns the two pieces of state that cross section boundaries: the session
 * shortlist and the account gate. Everything else is local to its section.
 *
 * The shortlist deliberately lives in memory only — the report puts account
 * creation at the moment a client saves or requests, not before.
 */
export default function ClientExperience({ creators }) {
  const [savedIds, setSavedIds] = useState([]);
  const [gate, setGate] = useState({ mode: null, context: '' });

  const toggleSave = useCallback((id) => {
    setSavedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  }, []);

  const openGate = useCallback((mode, context = '') => setGate({ mode, context }), []);
  const closeGate = useCallback(() => setGate({ mode: null, context: '' }), []);

  return (
    <>
      <Header variant="client" onAuth={openGate} />
      <main>
        <Hero creators={creators} />
        <DiscoveryPreview
          creators={creators}
          savedIds={savedIds}
          onToggleSave={toggleSave}
          onClearSaved={() => setSavedIds([])}
          onAuth={openGate}
        />
        <WhyVideoFirst creators={creators} />
        <HowItWorks />
        <BriefCTA onAuth={openGate} />
        <TrustSection />
        <RegionalSection />
        <FinalCTA />
      </main>
      <CreatorLane />
      <Footer />
      <AuthGateModal mode={gate.mode} context={gate.context} onClose={closeGate} />
    </>
  );
}
