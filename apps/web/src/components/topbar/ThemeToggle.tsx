import { useEffect } from "react";

export function ThemeToggle() {
  // Dark mode disabled for now. Force light theme and hide toggle.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", "light");
    try { localStorage.setItem("chainmail.theme", "light"); } catch { /* noop */ }
  }, []);

  return null;
}