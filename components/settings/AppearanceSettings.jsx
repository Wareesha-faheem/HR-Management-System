"use client";

import { useContext } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import ThemeContext from "@/contexts/ThemeContext";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

const OPTIONS = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <Card>
      <CardHeader><CardTitle>Appearance</CardTitle></CardHeader>
      <CardBody>
        <p className="text-sm text-secondary mb-4">Choose how Kuickpay HRMS looks on your device.</p>
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTheme(opt.key)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                theme === opt.key
                  ? "border-brand bg-brand-gradient-soft shadow-glow-brand"
                  : "border-[rgb(var(--border-subtle))] bg-surface-2 hover:border-brand/50"
              )}
            >
              <opt.icon className={cn("h-5 w-5", theme === opt.key ? "text-brand" : "text-secondary")} />
              <span className="text-sm font-medium text-primary">{opt.label}</span>
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
