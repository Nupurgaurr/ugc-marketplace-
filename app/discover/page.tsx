import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import DiscoverView from '@/components/client/DiscoverView';
import WhyVideoFirst from '@/components/client/WhyVideoFirst';
import HowItWorks from '@/components/client/HowItWorks';
import BriefCTA from '@/components/client/BriefCTA';
import TrustSection from '@/components/client/TrustSection';
import { getApprovedCreators } from '@/lib/data/creators';

export const metadata = { title: 'Find a UGC creator — blackcoffee. UGC' };

export default function DiscoverPage() {
  const creators = getApprovedCreators();

  return (
    <>
      <Header />
      <main>
        <section className="section" style={{ paddingBottom: '2rem' }}>
          <div className="container">
            <h1 className="display" style={{ maxWidth: '22ch' }}>
              Every video plays on hover. <em>No profile-clicking required.</em>
            </h1>
          </div>
        </section>

        <section className="section section--ruled" style={{ paddingTop: '2.5rem' }}>
          <div className="container">
            <DiscoverView creators={creators} />
          </div>
        </section>

        <WhyVideoFirst creators={creators} />
        <HowItWorks />
        <BriefCTA />
        <TrustSection />
      </main>
      <Footer />
    </>
  );
}
