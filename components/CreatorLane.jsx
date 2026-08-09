import Button from './ui/Button';
import styles from './footer.module.css';

/**
 * The report specifies two equal, public entry points on the landing page.
 * This page is the client lane, so the creator lane gets one honest strip
 * rather than equal billing above the fold.
 */
export default function CreatorLane() {
  return (
    <section className={styles.lane} id="creators">
      <div className={`container ${styles.laneInner}`}>
        <div>
          <h2 className={styles.laneTitle}>On the other side of the camera?</h2>
          <p className={styles.laneBody}>
            Apply to join the network. It is a short public form — no invite, no fee. A BCM
            reviewer watches your work and comes back either way.
          </p>
        </div>
        <Button as="a" href="#creators" variant="secondary" arrow>
          Become a creator
        </Button>
      </div>
    </section>
  );
}
