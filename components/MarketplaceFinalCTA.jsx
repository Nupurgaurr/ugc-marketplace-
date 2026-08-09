import Button from './ui/Button';
import { ROUTES } from '@/lib/routes';
import styles from './marketplace.module.css';

export default function MarketplaceFinalCTA() {
  return (
    <section className={styles.final}>
      <div className={`container ${styles.finalInner}`}>
        <h2 className={styles.finalTitle}>Pick a side and get started.</h2>
        <div className={styles.finalCtas}>
          <Button as="a" href={ROUTES.findCreator} variant="primary" arrow>
            Find a creator
          </Button>
          <Button as="a" href={ROUTES.becomeCreator} variant="primary" arrow>
            Become a creator
          </Button>
        </div>
        <p className={styles.finalNote}>
          Not sure which? <a href="mailto:brew@blackcoffee.media">brew@blackcoffee.media</a>
        </p>
      </div>
    </section>
  );
}
