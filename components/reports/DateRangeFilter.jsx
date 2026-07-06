"use client";

import { Calendar, RotateCcw } from "lucide-react";
import Input from "@/components/ui/Input";
import { cn } from "@/utils/cn";

const PRESETS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
];

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

const TODAY = new Date().toISOString().split("T")[0];

export default function DateRangeFilter({ startDate, endDate, onChange, activePreset, onPreset }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--border-subtle))] bg-surface-2 p-1">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => onPreset(p.days)}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              activePreset === p.days ? "bg-brand-gradient text-white" : "text-secondary hover:text-primary"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <Calendar className="h-4 w-4 text-secondary" />
        <Input
          type="date"
          value={startDate}
          max={endDate}
          onChange={(e) => onChange({ startDate: e.target.value, endDate })}
          className="w-36"
        />
        <span className="text-secondary text-sm">to</span>
        <Input
          type="date"
          value={endDate}
          min={startDate}
          max={TODAY}
          onChange={(e) => onChange({ startDate, endDate: e.target.value })}
          className="w-36"
        />
      </div>

      <button
        onClick={() => onPreset(30)}
        title="Reset to last 30 days"
        className="rounded-lg p-2 text-secondary hover:bg-surface-2 hover:text-primary transition-colors"
      >
        <RotateCcw className="h-4 w-4" />
      </button>
    </div>
  );
}

export { isoDaysAgo };
