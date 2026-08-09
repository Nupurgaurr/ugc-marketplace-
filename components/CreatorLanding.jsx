'use client';

import { useCallback, useState } from 'react';
import Header from './Header';
import CreatorHero from './CreatorHero';
import CreatorBenefits from './CreatorBenefits';
import CreatorJourney from './CreatorJourney';
import CreatorProfilePreview from './CreatorProfilePreview';
import ClientViewPreview from './ClientViewPreview';
import CreatorVetting from './CreatorVetting';
import RequestInbox from './RequestInbox';
import ApplicationForm from './ApplicationForm';
import CreatorFAQ from './CreatorFAQ';
import CreatorFinalCTA from './CreatorFinalCTA';
import Footer from './Footer';
import AuthGateModal from './AuthGateModal';

/**
 * Public creator acquisition experience. Shares the header, footer, buttons,
 * form styling, card component and playback hook with the client side — the
 * only thing that changes is who is being spoken to.
 */
export default function CreatorLanding({ creators, profile, requests }) {
  const [gate, setGate] = useState({ mode: null, context: '' });
  const openGate = useCallback((mode, context = '') => setGate({ mode, context }), []);
  const closeGate = useCallback(() => setGate({ mode: null, context: '' }), []);

  return (
    <>
      <Header variant="creator" onAuth={openGate} />
      <main>
        <CreatorHero creators={creators} />
        <CreatorBenefits />
        <CreatorJourney />
        <CreatorProfilePreview profile={profile} />
        <ClientViewPreview creators={creators} />
        <CreatorVetting />
        <RequestInbox requests={requests} />
        <ApplicationForm />
        <CreatorFAQ />
        <CreatorFinalCTA />
      </main>
      <Footer />
      <AuthGateModal mode={gate.mode} context={gate.context} onClose={closeGate} />
    </>
  );
}
