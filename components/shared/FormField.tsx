import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Labeled text input with inline error text.
 *
 * **Must forward its ref.** Callers spread `register()` onto this component,
 * and React strips `ref` out of the props of a plain function component, so
 * without `forwardRef` react-hook-form never sees the DOM node: the field
 * reads back as `undefined` and every value a person types is discarded at
 * validation time.
 */
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(function FormField(
  { label, error, id, ...inputProps },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <label className={styles.field} htmlFor={inputId}>
      <span className={styles.label}>{label}</span>
      <input
        id={inputId}
        ref={ref}
        className={styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <span id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </label>
  );
});

export default FormField;
