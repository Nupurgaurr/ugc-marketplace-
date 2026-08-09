import Eyebrow from './ui/Eyebrow';
import Tag from './ui/Tag';
import PortfolioTile from './PortfolioTile';
import { formatRate } from './CreatorCard';
import styles from './creator.module.css';

/**
 * What an approved profile looks like. Everything the report lists — bio,
 * categories and content styles, languages, location, availability, past work,
 * optional rate — is arranged as a narrow supporting rail so the portfolio grid
 * takes the space.
 */
export default function CreatorProfilePreview({ profile }) {
  return (
    <section className="section section--ruled" id="profile">
      <div className="container">
        <Eyebrow>Your profile</Eyebrow>
        <h2 className="display" style={{ maxWidth: '18ch' }}>
          The portfolio is the profile. <em>Everything else supports it.</em>
        </h2>

        <div className={styles.profile}>
          <aside>
            <div className={styles.profileHead}>
              <img className={styles.avatar} src={profile.preview.posterUrl} alt="" />
              <div>
                <p className={styles.profileName}>
                  {profile.name}
                  <span className={styles.approved}>Approved</span>
                </p>
                <p className={styles.profileWhere}>
                  {profile.city}, {profile.state} · {profile.category}
                </p>
              </div>
            </div>

            <div className={styles.block}>
              <p className={styles.blockLabel}>Bio</p>
              <p className={styles.blockBody}>{profile.bio}</p>
            </div>

            <div className={styles.block}>
              <p className={styles.blockLabel}>Content styles</p>
              <div className={styles.chipRow}>
                {profile.contentStyles.map((style) => (
                  <Tag key={style}>{style}</Tag>
                ))}
              </div>
            </div>

            <div className={styles.block}>
              <p className={styles.blockLabel}>Languages</p>
              <div className={styles.chipRow}>
                {profile.languages.map((language) => (
                  <Tag key={language}>{language}</Tag>
                ))}
              </div>
            </div>

            <div className={styles.block}>
              <p className={styles.blockLabel}>Availability</p>
              <p className={styles.availability}>
                <span className={styles.availDot} aria-hidden="true" />
                {profile.availability}
              </p>
            </div>

            <div className={styles.block}>
              <p className={styles.blockLabel}>Rate range (optional)</p>
              <p className={styles.blockBody}>
                {formatRate(profile.rateMin, profile.rateMax)} per finished video
              </p>
            </div>

            <div className={styles.block}>
              <p className={styles.blockLabel}>Past work</p>
              <ul className={styles.pastList}>
                {profile.pastWork.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div>
            <div className={styles.portfolioHead}>
              <p className={styles.portfolioLabel}>
                Portfolio — {profile.portfolio.length} videos
              </p>
              <p className={styles.portfolioLabel}>Hover to play</p>
            </div>
            <div className={styles.portfolioGrid}>
              {profile.portfolio.map((item) => (
                <PortfolioTile key={item.id} item={item} creatorName={profile.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
