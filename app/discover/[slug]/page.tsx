import { notFound } from 'next/navigation';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import CreatorProfileView from '@/components/client/CreatorProfileView';
import { getCreatorBySlug } from '@/lib/data/creators';

export default function CreatorProfilePage({ params }: { params: { slug: string } }) {
  const creator = getCreatorBySlug(params.slug);
  if (!creator || creator.status !== 'approved') notFound();

  return (
    <>
      <Header />
      <main>
        <section className="section">
          <div className="container">
            <CreatorProfileView creator={creator} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
