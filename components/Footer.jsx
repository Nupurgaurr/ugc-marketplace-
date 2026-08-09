import Button from './ui/Button';
import styles from './footer.module.css';

const MARKETPLACE = [
  { label: 'Browse creators', href: '#discover' },
  { label: 'Post a brief', href: '#brief' },
  { label: 'Become a creator', href: '#creators' },
  { label: 'How it works', href: '#how-it-works' },
];

const BCM = [
  { label: 'Home', href: 'https://blackcoffee.media/' },
  { label: 'About', href: 'https://blackcoffee.media/about-us/' },
  { label: 'Team', href: 'https://blackcoffee.media/team/' },
  { label: 'Services', href: 'https://blackcoffee.media/services/' },
  { label: 'Our Work', href: 'https://blackcoffee.media/blogs/' },
  { label: 'Jobs', href: 'https://blackcoffee.media/careers/' },
  { label: 'Contact', href: 'https://blackcoffee.media/contact/' },
];

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/blackcoffee_media/', glyph: 'IG' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/blackcoffee-media/', glyph: 'in' },
  { label: 'Facebook', href: 'https://www.facebook.com/blackcoffee.media.agency/', glyph: 'f' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <h2 className={styles.talk}>
            Let&apos;s talk <em>growth.</em>
          </h2>
          <div>
            <p className={styles.newsLabel}>Get the BCM growth digest</p>
            <div className={styles.newsRow}>
              <input
                className={styles.newsInput}
                type="email"
                placeholder="Work email"
                aria-label="Work email for the BCM growth digest"
              />
              <Button variant="secondary">Notify me</Button>
            </div>
          </div>
        </div>

        <div className={styles.cols}>
          <div>
            <p className={styles.colTitle}>Marketplace</p>
            <ul className={styles.list}>
              {MARKETPLACE.map((item) => (
                <li key={item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={styles.colTitle}>Blackcoffee Media</p>
            <ul className={styles.list}>
              {BCM.map((item) => (
                <li key={item.label}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={styles.colTitle}>Contact</p>
            <p className={styles.address}>
              <b>Mumbai</b>
              Blackcoffee Media LLP, WeWork Vaswani Chambers, Dr Annie Besant Rd, Worli,
              Mumbai 400 030
            </p>
            <p className={styles.address}>
              <b>Vadodara HQ</b>
              Odyssey Co-working, near Balaji Hospital, Subhanpura, Vadodara 390023
            </p>
            <ul className={styles.list}>
              <li>
                <a href="tel:+919920713935">99207 13935</a>
              </li>
              <li>
                <a href="mailto:brew@blackcoffee.media">brew@blackcoffee.media</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>Copyright © 2026 Blackcoffee Media</p>
          <div className={styles.social}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                className={styles.socialLink}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
              >
                <span aria-hidden="true" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                  {s.glyph}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
