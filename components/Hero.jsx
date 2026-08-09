import Button from './ui/Button';
import Eyebrow from './ui/Eyebrow';
import Tag from './ui/Tag';
import ReelWall from './ReelWall';
import styles from './hero.module.css';

export default function Hero({ creators }) {
  return (
    <section className={styles.hero} id="top">
      <div className={`container ${styles.grid}`}>
        <div>
          <Eyebrow>Blackcoffee Media · UGC creator network</Eyebrow>

          <h1 className={styles.headline}>
            Pick creators from their work.
            <em>Not their bio.</em>
          </h1>

          <p className={styles.lede}>
            A vetted UGC creator network for Indian brands. Watch real portfolio videos,
            narrow by category, language, city and rate, and shortlist in a single pass.
            We coordinate the match from there.
          </p>

          <div className={styles.ctas}>
            <Button as="a" href="#discover" variant="primary" arrow>
              Find a creator
            </Button>
            <Button as="a" href="#brief" variant="secondary">
              Post a brief
            </Button>
          </div>

          <p className={styles.note}>
            Browsing is open — no account needed. You only sign up when you save a
            shortlist or send a request.
          </p>

          <div className={styles.pills}>
            <Tag accent>Reviewed before visible</Tag>
            <Tag>Regional languages first</Tag>
            <Tag>BCM stays on the campaign</Tag>
          </div>
        </div>

        <ReelWall creators={creators} />
      </div>
    </section>
  );
}
