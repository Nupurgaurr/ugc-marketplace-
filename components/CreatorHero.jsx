import Button from './ui/Button';
import Eyebrow from './ui/Eyebrow';
import Tag from './ui/Tag';
import ReelWall from './ReelWall';
import styles from './creator.module.css';

/**
 * Mirrors the client hero — same ReelWall component, flipped to the left — so
 * both sides of the marketplace are recognisably the same product.
 */
export default function CreatorHero({ creators }) {
  return (
    <section className={styles.hero} id="top">
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroVisual}>
          <ReelWall creators={creators} />
        </div>

        <div>
          <Eyebrow>Become a UGC partner</Eyebrow>

          <h1 className={styles.heroTitle}>
            Put your work where brands are already looking.
          </h1>

          <p className={styles.heroLede}>
            Apply to join BCM&apos;s vetted creator network. Our team reviews every
            application, and once you&apos;re approved your portfolio is what brands browse
            — no pitching, no cold outreach, no follower minimums.
          </p>

          <div className={styles.heroCtas}>
            <Button as="a" href="#apply" variant="primary" arrow>
              Become a UGC partner
            </Button>
            <Button as="a" href="#journey" variant="secondary">
              See how it works
            </Button>
          </div>

          <p className={styles.heroNote}>
            Applying is free and open to anyone. Approval is not automatic — a person
            reviews your work, and you hear back either way.
          </p>

          <div className={styles.heroPills}>
            <Tag accent>No invite needed</Tag>
            <Tag>Reviewed by a person</Tag>
            <Tag>Portfolio is the profile</Tag>
          </div>
        </div>
      </div>
    </section>
  );
}
