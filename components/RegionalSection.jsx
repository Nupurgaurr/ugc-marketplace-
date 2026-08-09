import Eyebrow from './ui/Eyebrow';
import Marquee from './ui/Marquee';
import { languagesInNetwork } from '@/lib/creators';
import styles from './sections.module.css';

/**
 * The report's clearest positioning gap: none of the researched platforms are
 * India / regional-language first. Language is treated as a first-class filter
 * here, so this section shows the vocabulary rather than claiming coverage.
 */
export default function RegionalSection() {
  return (
    <section className="section section--ruled">
      <div className="container">
        <Eyebrow>Language</Eyebrow>
      </div>

      <Marquee duration={52}>
        <div className={styles.langTrack}>
          {languagesInNetwork.map((language, i) => (
            <span
              key={language}
              className={`${styles.lang} ${i % 3 === 1 ? styles.langAccent : ''}`}
            >
              {language}
            </span>
          ))}
        </div>
      </Marquee>

      <div className="container">
        <div className={styles.regionalCopy}>
          <h2 className="display" style={{ maxWidth: '15ch' }}>
            Shot in the language <em>your customer actually buys in.</em>
          </h2>
          <p className="lede">
            The platforms we looked at are built English-first and US-first. Here, language
            sits next to category as a primary filter — so a Tamil skincare testimonial or a
            Marathi unboxing is something you search for, not something you have to explain
            in a brief.
          </p>
        </div>
      </div>
    </section>
  );
}
