import styles from './MemeBeat.module.css';

/**
 * The Bollywood-flavored beat shown on every creator wizard step. Ships with
 * witty original text (no copyrighted stills/quotes). Pass `imageSrc` once
 * you drop a real licensed meme/GIF into public/media/memes/ — it renders
 * automatically in place of the quote mark, no other code changes needed.
 * See HANDOVER_GUIDE.md → "Swapping in real meme images".
 */
export default function MemeBeat({
  line,
  caption,
  emoji,
  imageSrc,
  imageAlt,
}: {
  line: string;
  caption?: string;
  emoji?: string;
  imageSrc?: string;
  imageAlt?: string;
}) {
  return (
    <div className={styles.card}>
      {imageSrc ? (
        <img className={styles.image} src={imageSrc} alt={imageAlt ?? line} />
      ) : (
        <span className={styles.quoteMark} aria-hidden="true">
          {emoji ?? '“'}
        </span>
      )}
      <div className={styles.text}>
        <p className={styles.line}>{line}</p>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    </div>
  );
}
