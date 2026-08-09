import Button from './ui/Button';
import { ROUTES } from '@/lib/routes';
import styles from './marketplace.module.css';

/**
 * Compact and centred on purpose — the two entry panels sit directly beneath
 * it, so the hero's job is to name the thing and get out of the way.
 */
export default function MarketplaceHero() {
  return (
    <section className={styles.hero} id="top">
      <div className={`container ${styles.heroInner}`}>
        <p className={styles.heroEyebrow}>
          <span aria-hidden="true" />
          A Blackcoffee Media product
        </p>

        <h1 className={styles.heroTitle}>
          The UGC network, <em>run like an agency.</em>
        </h1>

        <p className={styles.heroLede}>
          Brands browse vetted creators and watch their actual work before asking for
          anyone. Creators apply once, get reviewed by our team, and get put in front of
          real campaigns. BCM sits in the middle and stays there.
        </p>

        <div className={styles.heroCtas}>
          <Button as="a" href={ROUTES.findCreator} variant="secondary" arrow>
            Find a creator
          </Button>
          <Button as="a" href={ROUTES.becomeCreator} variant="secondary" arrow>
            Become a creator
          </Button>
        </div>

        <p className={styles.heroCue}>Which side are you on?</p>
      </div>
    </section>
  );
}
