import Button from './ui/Button';
import styles from './creator.module.css';

export default function CreatorFinalCTA() {
  return (
    <section className={styles.final}>
      <div className={`container ${styles.finalInner}`}>
        <h2 className={styles.finalTitle}>Ready to create with BCM?</h2>
        <div className={styles.finalCtas}>
          <Button as="a" href="#apply" variant="primary" arrow>
            Become a UGC partner
          </Button>
        </div>
        <p className={styles.finalNote}>
          Free to apply · reviewed by a person · you hear back either way
        </p>
      </div>
    </section>
  );
}
