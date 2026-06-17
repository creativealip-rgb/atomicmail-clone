import styles from "./Avatar.module.css";

export interface AvatarProps {
  name: string;       // email or display name
  size?: number;      // px
  src?: string;
}

const PALETTES = [
  ["#C091FF", "#8A8FFB"],
  ["#7DCFFF", "#067DF7"],
  ["#0DF189", "#00B95C"],
  ["#FBBC04", "#FF3636"],
  ["#FF98F0", "#C091FF"],
  ["#0CE884", "#0561FF"],
] as const;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({ name, size = 32, src }: AvatarProps) {
  const letter = (name[0] ?? "?").toUpperCase();
  const palette = PALETTES[hash(name) % PALETTES.length] ?? PALETTES[0]!;
  const [from, to] = palette;
  const style = {
    width: size,
    height: size,
    fontSize: Math.max(11, size * 0.42),
    background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
  };

  if (src) {
    return <img className={styles.img} src={src} alt="" style={{ width: size, height: size }} />;
  }

  return (
    <div className={styles.avatar} style={style} aria-label={name}>
      {letter}
    </div>
  );
}
