import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ width = "100%", height = "1em", radius, className = "", style }: SkeletonProps) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      aria-hidden
    />
  );
}

interface RowProps {
  count?: number;
  avatar?: boolean;
  className?: string;
}

export function SkeletonRow({ count = 1, avatar = false, className = "" }: RowProps) {
  return (
    <div className={`${styles.row} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.rowItem}>
          {avatar && <Skeleton width={32} height={32} radius="50%" />}
          <div className={styles.rowLines}>
            <Skeleton width={`${60 + ((i * 17) % 35)}%`} height={13} />
            <Skeleton width={`${40 + ((i * 23) % 30)}%`} height={11} />
          </div>
          <Skeleton width={42} height={11} />
        </div>
      ))}
    </div>
  );
}

interface TableRowsProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function SkeletonTableRows({ rows = 5, cols = 4, className = "" }: TableRowsProps) {
  return (
    <div className={`${styles.tableWrap} ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          {Array.from({ length: cols }).map((__, j) => (
            <Skeleton
              key={j}
              width={j === 0 ? "30%" : `${50 + ((j * 13 + i * 7) % 35)}%`}
              height={12}
            />
          ))}
        </div>
      ))}
    </div>
  );
}