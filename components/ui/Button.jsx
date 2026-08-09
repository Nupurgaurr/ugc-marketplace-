import styles from './ui.module.css';

const VARIANTS = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
};

/**
 * One button component for the whole surface so CTA styling stays consistent
 * between the header, hero, brief form and final CTA.
 */
export default function Button({
  as = 'button',
  variant = 'secondary',
  size,
  block = false,
  arrow = false,
  className = '',
  children,
  ...rest
}) {
  const Tag = as;
  const classes = [
    styles.btn,
    VARIANTS[variant],
    size === 'small' ? styles.small : '',
    block ? styles.block : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      )}
    </Tag>
  );
}
