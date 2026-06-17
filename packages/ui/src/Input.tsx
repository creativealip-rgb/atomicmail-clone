import { forwardRef, type InputHTMLAttributes, useId } from "react";
import styles from "./Input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, fullWidth, id, className, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className={[styles.wrap, fullWidth && styles.fullWidth, className].filter(Boolean).join(" ")}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[styles.input, error && styles.invalid].filter(Boolean).join(" ")}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${inputId}-err` : helper ? `${inputId}-help` : undefined}
          {...rest}
        />
        {error ? (
          <p id={`${inputId}-err`} className={styles.error}>
            {error}
          </p>
        ) : helper ? (
          <p id={`${inputId}-help`} className={styles.helper}>
            {helper}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
