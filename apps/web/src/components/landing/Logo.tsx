import styles from "./Logo.module.css";

interface Props {
  size?: number;
  withText?: boolean;
}

/**
 * Chainmail weave logo — 4 interlocking rings forming a square pattern.
 * Concept: medieval mail armor × crypto chain links.
 * Outer ring: brand/purple-deep · inner: teal→blue gradient
 */
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
          <linearGradient id="chainGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0CE884" />
            <stop offset="50%" stopColor="#067DF7" />
            <stop offset="100%" stopColor="#6648FF" />
          </linearGradient>
        </defs>
        {/* Four interlocking rings in 2x2 grid, each overlaps its 2 neighbors */}
        {/* top-left ring */}
        <circle cx="11" cy="11" r="7" stroke="url(#chainGrad)" strokeWidth="2" fill="none" />
        {/* top-right ring */}
        <circle cx="21" cy="11" r="7" stroke="url(#chainGrad)" strokeWidth="2" fill="none" />
        {/* bottom-left ring */}
        <circle cx="11" cy="21" r="7" stroke="url(#chainGrad)" strokeWidth="2" fill="none" />
        {/* bottom-right ring */}
        <circle cx="21" cy="21" r="7" stroke="url(#chainGrad)" strokeWidth="2" fill="none" />
        {/* center accent dot */}
        <circle cx="16" cy="16" r="2" fill="url(#chainGrad)" />
      </svg>
      {withText && <span className={styles.text}>Chainmail</span>}
    </span>
  );
}
