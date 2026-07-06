"use client";

import { useContext } from "react";
import ThemeContext from "@/contexts/ThemeContext";

// Recharts doesn't know about our CSS variables, so tooltip/axis/legend
// colors are resolved from the live theme here and reused across every
// chart so they stay legible in both light and dark mode instead of
// defaulting to recharts' hardcoded white tooltip background.
export function useChartTheme() {
  const { theme } = useContext(ThemeContext); // eslint-disable-line no-unused-vars -- re-render trigger so colors track live theme toggles

  if (typeof window === "undefined") {
    return { grid: "rgba(128,128,128,0.15)", text: "#5A6482", tooltipBg: "#fff", tooltipBorder: "rgba(128,128,128,0.2)" };
  }

  const styles = getComputedStyle(document.documentElement);
  const toRgb = (name, fallback) => {
    const v = styles.getPropertyValue(name).trim();
    return v ? `rgb(${v})` : fallback;
  };

  return {
    grid: "rgba(128,128,128,0.15)",
    text: toRgb("--text-secondary", "#5A6482"),
    tooltipBg: toRgb("--bg-surface", "#fff"),
    tooltipBorder: toRgb("--border-subtle", "rgba(128,128,128,0.2)"),
  };
}
