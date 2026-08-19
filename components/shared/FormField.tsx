import type { InputHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.label}>{label}</span>
      <input id={id} className={styles.input} {...inputProps} />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
}
