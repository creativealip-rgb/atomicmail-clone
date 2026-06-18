import styles from "./Logo.module.css";

interface Props {
  size?: number;
  withText?: boolean;
}

export function Logo({ size = 32, withText = false }: Props) {
  return (
    <span className={styles.wrap} style={{ fontSize: size }}>
      <svg
        className={styles.mark}
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Chainmail"
      >
        <defs>
          <linearGradient id="atomGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0DF189" />
            <stop offset="100%" stopColor="#067DF7" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="3" fill="url(#atomGrad)" />
        <ellipse cx="16" cy="16" rx="13" ry="5" stroke="url(#atomGrad)" strokeWidth="1.5" transform="rotate(0 16 16)" />
        <ellipse cx="16" cy="16" rx="13" ry="5" stroke="url(#atomGrad)" strokeWidth="1.5" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="13" ry="5" stroke="url(#atomGrad)" strokeWidth="1.5" transform="rotate(120 16 16)" />
      </svg>
      {withText && <span className={styles.text}>Chainmail</span>}
    </span>
  );
}
