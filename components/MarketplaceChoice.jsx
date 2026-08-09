import ClientPathway from './ClientPathway';
import CreatorPathway from './CreatorPathway';
import styles from './marketplace.module.css';

/**
 * The page's whole reason to exist: two equal doors. Identical widths, type
 * scale and CTA treatment — only the supporting visual differs, because the two
 * jobs genuinely differ.
 */
export default function MarketplaceChoice({ creators }) {
  return (
    <section className={styles.choice} id="choose" aria-label="Choose your pathway">
      <ClientPathway creators={creators} />
      <CreatorPathway creator={creators[4] ?? creators[0]} />
    </section>
  );
}
