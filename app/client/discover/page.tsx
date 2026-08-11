import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import DiscoverView from '@/components/client/DiscoverView';
import Eyebrow from '@/components/shared/Eyebrow';
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
            <Eyebrow>Browse creators</Eyebrow>
            <h1 className="display" style={{ marginTop: '0.6rem', maxWidth: '20ch' }}>
              Hover to preview. No account needed to look.
            </h1>
          </div>
        </section>
        <section className="section section--ruled" style={{ paddingTop: '2.5rem' }}>
          <div className="container">
            <DiscoverView creators={creators} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
