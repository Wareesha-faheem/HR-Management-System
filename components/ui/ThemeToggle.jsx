"use client";

import { useContext } from "react";
import { Sun, Moon } from "lucide-react";
import ThemeContext from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[rgb(var(--border-subtle))] bg-surface-2 text-secondary transition-all duration-150 hover:border-brand/30 hover:text-brand"
    >
      <Sun className={`h-4.5 w-4.5 absolute transition-all duration-300 ${theme === "dark" ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"}`} />
      <Moon className={`h-4.5 w-4.5 absolute transition-all duration-300 ${theme === "dark" ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"}`} />
    </button>
  );
}
