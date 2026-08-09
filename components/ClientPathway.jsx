import { ROUTES } from '@/lib/routes';
import styles from './marketplace.module.css';

/**
 * The brand side. Its visual is a mosaic of many creators, because that is the
 * shape of the job on this side: scan a lot of work quickly.
 */
export default function ClientPathway({ creators }) {
  return (
    <div className={styles.panel}>
      <p className={styles.panelEyebrow}>For brands</p>
      <h2 className={styles.panelTitle}>I need a creator</h2>
      <p className={styles.panelBody}>
        Browse the approved network, watch portfolio videos as you scroll, filter by
        category, language, city and rate, then shortlist and request. No account needed
        to look around — or hand us a brief and we&apos;ll do the shortlisting.
      </p>

      <a className={styles.panelCta} href={ROUTES.findCreator}>
        Find a creator
        <span aria-hidden="true">→</span>
      </a>

      <div className={styles.panelVisual}>
        <div className={styles.mosaic}>
          {creators.slice(0, 4).map((creator) => (
            <div className={styles.mosaicTile} key={creator.id}>
              <img src={creator.preview.posterUrl} alt="" loading="lazy" />
            </div>
          ))}
        </div>
        <p className={styles.visualCaption}>Every tile is a real portfolio video</p>
      </div>
    </div>
  );
}
