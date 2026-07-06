"use client";

import { cn } from "@/utils/cn";

const THRESHOLD_COLORS = [
  { min: 90, className: "bg-emerald-500" },
  { min: 75, className: "bg-amber-500" },
  { min: 0, className: "bg-red-500" },
];

// Renders a colored bar; if `thresholds` is true, color reflects the value
// (green/amber/red) rather than always using the brand gradient — useful
// for rates like attendance % where the color itself carries meaning.
export default function ProgressBar({ value, max = 100, thresholds = false, className, barClassName }) {
  const pct = max ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const color = thresholds
    ? THRESHOLD_COLORS.find((t) => pct >= t.min)?.className
    : null;

  return (
    <div className={cn("h-1.5 w-full rounded-full bg-surface-2 overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", color || "bg-brand-gradient", barClassName)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
