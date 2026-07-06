"use client";

import { createContext, useEffect, useState } from "react";
import { loadState, saveState, STORAGE_KEYS } from "@/utils/storage";

const ThemeContext = createContext(null);
export default ThemeContext;

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadState(STORAGE_KEYS.THEME, null);
    const systemPrefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initial = stored || (systemPrefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setReady(true);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      saveState(STORAGE_KEYS.THEME, next);
      return next;
    });
  }

  function setThemeExplicit(next) {
    document.documentElement.classList.toggle("dark", next === "dark");
    saveState(STORAGE_KEYS.THEME, next);
    setTheme(next);
  }

  return (
    <ThemeContext.Provider value={{ theme, ready, toggleTheme, setTheme: setThemeExplicit }}>
      {children}
    </ThemeContext.Provider>
  );
}
