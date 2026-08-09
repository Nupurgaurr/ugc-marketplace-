import Eyebrow from './ui/Eyebrow';
import styles from './creator.module.css';

/**
 * Benefits are written against what the report actually promises. Nothing here
 * claims volume of work, income or brand names.
 */
const BENEFITS = [
  {
    title: 'A network, not a directory',
    body: 'Every creator here has been through review. Being in a smaller vetted pool means brands arrive expecting quality rather than sifting.',
  },
  {
    title: 'A profile built around your work',
    body: 'Bio, categories, content styles, languages, location and availability — all of it sits around the portfolio grid, not in front of it.',
  },
  {
    title: 'Videos that play, not links that die',
    body: 'Your portfolio uploads play right in the browsing grid. Brands judge the work itself instead of clicking through to a dead sample link.',
  },
  {
    title: 'Discoverable by filter',
    body: 'Brands search by category, content style, language, city and rate. Regional-language work is something they look for, not something you argue for.',
  },
  {
    title: 'Requests come to you',
    body: 'When a brand wants you, the request lands in your inbox with the campaign and the requirement attached. You decide whether to take it.',
  },
  {
    title: 'A team in the middle',
    body: 'BCM confirms the brief, coordinates the match and stays on quality through delivery — so you are dealing with us, not a stranger.',
  },
];

export default function CreatorBenefits() {
  return (
    <section className="section section--ruled" id="why">
      <div className="container">
        <Eyebrow>Why join</Eyebrow>
        <h2 className="display" style={{ maxWidth: '19ch' }}>
          Your work does the pitching. <em>We do the introductions.</em>
        </h2>

        <div className={styles.benefits}>
          {BENEFITS.map((benefit) => (
            <div className={styles.benefit} key={benefit.title}>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitBody}>{benefit.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
