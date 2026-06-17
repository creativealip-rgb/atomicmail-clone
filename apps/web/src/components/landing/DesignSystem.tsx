import styles from "./DesignSystem.module.css";

const COLORS = [
  { name: "brand/blue",        hex: "#067DF7" },
  { name: "brand/purple",      hex: "#8A8FFB" },
  { name: "brand/cyan",        hex: "#7DCFFF" },
  { name: "brand/green",       hex: "#0DF189" },
  { name: "brand/red",         hex: "#FF3636" },
  { name: "brand/orange",      hex: "#FBBC04" },
  { name: "neutral/100",       hex: "#F5F5F4" },
  { name: "neutral/200",       hex: "#EAEAEA" },
  { name: "neutral/600",       hex: "#8E8E93" },
  { name: "neutral/900",       hex: "#000000" },
];

const TYPE_SCALE = [
  { name: "xs",   size: "10px" },
  { name: "sm",   size: "12px" },
  { name: "base", size: "16px" },
  { name: "lg",   size: "18px" },
  { name: "xl",   size: "20px" },
  { name: "2xl",  size: "22px" },
  { name: "3xl",  size: "26px" },
  { name: "4xl",  size: "34px" },
];

const RADIUS = [
  { name: "sm",   value: "8px" },
  { name: "md",   value: "10px" },
  { name: "lg",   value: "12px" },
  { name: "xl",   value: "16px" },
  { name: "2xl",  value: "20px" },
  { name: "3xl",  value: "24px" },
  { name: "pill", value: "32px" },
];

const SHADOWS = [
  { name: "xs",  value: "0 2px 6px 0 rgba(0,0,0,0.10)" },
  { name: "md",  value: "0 4px 12px rgba(0,0,0,0.10)" },
  { name: "lg",  value: "0 4px 12px rgba(0,0,0,0.10), 0 0 0 2px rgba(0,0,0,0.20)" },
  { name: "xl",  value: "3px 3px 21px 0 rgba(0,0,0,0.30)" },
];

export function DesignSystem() {
  return (
    <section id="design">
      <header className={styles.header}>
        <h2>Design system</h2>
        <p>Extracted from atomicmail.io via DOM inspection + bundle analysis. Reusable tokens & components.</p>
      </header>

      <div className={styles.grid}>
        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Colors</h3>
          <div className={styles.swatches}>
            {COLORS.map((c) => (
              <div key={c.hex} className={styles.swatch}>
                <div className={styles.chip} style={{ background: c.hex }} />
                <div className={styles.swatchMeta}>
                  <code>{c.name}</code>
                  <code className={styles.hex}>{c.hex}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Type scale</h3>
          <div className={styles.typeList}>
            {TYPE_SCALE.map((t) => (
              <div key={t.name} className={styles.typeRow}>
                <code className={styles.typeLabel}>--fs-{t.name} · {t.size}</code>
                <div className={styles.typeSample} style={{ fontSize: t.size }}>Encrypted mail</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Border radius</h3>
          <div className={styles.radiusList}>
            {RADIUS.map((r) => (
              <div key={r.name} className={styles.radiusItem}>
                <div className={styles.radiusBox} style={{ borderRadius: r.value, background: "var(--color-brand-blue)" }} />
                <code className={styles.radiusLabel}>{r.name} · {r.value}</code>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.panelTitle}>Shadow</h3>
          <div className={styles.shadowList}>
            {SHADOWS.map((s) => (
              <div key={s.name} className={styles.shadowItem}>
                <div className={styles.shadowBox} style={{ boxShadow: s.value }} />
                <code className={styles.shadowLabel}>{s.name}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
