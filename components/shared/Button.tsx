import type { ReactNode } from 'react';
import Link from 'next/link';
import { cx } from '@/lib/utils';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'default' | 'small';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

interface ButtonAsButton extends BaseProps {
  href?: undefined;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  onClick?: () => void;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export default function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'default', block, arrow, className, children } = props;
  const classes = cx(
    styles.btn,
    styles[variant],
    size === 'small' && styles.small,
    block && styles.block,
    className
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes} onClick={props.onClick}>
        {children}
        {arrow && (
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        )}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button
      type={buttonProps.type ?? 'button'}
      className={classes}
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
    >
      {children}
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      )}
    </button>
  );
}
