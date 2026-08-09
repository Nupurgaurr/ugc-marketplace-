import Button from './ui/Button';
import Eyebrow from './ui/Eyebrow';
import { ROUTES } from '@/lib/routes';
import styles from './marketplace.module.css';

/**
 * A teaser, not the discovery page. Five tiles play so a visitor understands
 * that browsing here means watching — then they get sent to the real grid.
 */
export default function CreatorPreview({ creators }) {
  const strip = creators.slice(0, 5);

  return (
    <section className={`section section--ruled ${styles.preview}`} id="preview">
      <div className="container">
        <div className={styles.previewHead}>
          <div>
            <Eyebrow>Video-first</Eyebrow>
            <h2 className="display" style={{ maxWidth: '16ch' }}>
              You see the work. <em>Not a list of names.</em>
            </h2>
            <p className={styles.previewCopy}>
              Portfolios play as you scroll, so you can judge a creator in three seconds
              instead of opening a profile to find out.
            </p>
          </div>
          <Button as="a" href={ROUTES.findCreator} variant="secondary" arrow>
            Browse the network
          </Button>
        </div>

        <div className={styles.strip}>
          {strip.map((creator) => (
            <div className={styles.stripTile} key={creator.id}>
              <video
                src={creator.preview.previewUrl}
                poster={creator.preview.posterUrl}
                muted
                loop
                autoPlay
                playsInline
                preload="none"
                aria-label={`Portfolio preview from ${creator.name}`}
              />
              <div className={styles.stripScrim}>
                <p className={styles.stripName}>{creator.name}</p>
                <p className={styles.stripMeta}>
                  {creator.category} · {creator.languages[0]}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.previewFoot}>
          <p className={styles.previewNote}>
            Filter by category, content style, language, city and rate. Language sits next
            to category, not buried in a brief.
          </p>
          <Button as="a" href={ROUTES.findCreator} variant="secondary" arrow>
            Find a creator
          </Button>
        </div>
      </div>
    </section>
  );
}
