import Button from './ui/Button';
import styles from './sections.module.css';

export default function FinalCTA() {
  return (
    <section className={`section--ruled ${styles.final}`}>
      <div className={`container ${styles.finalInner}`}>
        <h2 className={styles.finalHeading}>Find the creator for your next campaign.</h2>
        <div className={styles.finalCtas}>
          <Button as="a" href="#discover" variant="primary" arrow>
            Find a creator
          </Button>
          <Button as="a" href="#brief" variant="secondary">
            Post a brief
          </Button>
        </div>
        <p className={styles.finalNote}>
          Rather talk it through? <a href="mailto:brew@blackcoffee.media">brew@blackcoffee.media</a>
        </p>
      </div>
    </section>
  );
}
