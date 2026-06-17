import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setTheme } from "@/store/slices/userSlice";
import styles from "./TopBar.module.css";

export function ThemeToggle() {
  const theme = useAppSelector((s) => s.user.theme);
  const dispatch = useAppDispatch();

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      className={styles.themeToggle}
      onClick={() => dispatch(setTheme(isDark ? "light" : "dark"))}
      aria-label="Switch to dark mode"
      role="switch"
      aria-checked={isDark}
    >
      {isDark ? "🌙" : "☀"}
    </button>
  );
}
