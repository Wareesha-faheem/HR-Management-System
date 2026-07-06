"use client";

import { useContext } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import ToastContext from "@/contexts/ToastContext";
import { cn } from "@/utils/cn";

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  default: Info,
};

const COLORS = {
  success: "text-emerald-500",
  error: "text-red-500",
  default: "text-brand",
};

export default function ToastViewport() {
  const { toasts, dismiss } = useContext(ToastContext);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => {
        const Icon = ICONS[t.variant] || ICONS.default;
        return (
          <div
            key={t.id}
            className="glass-panel shadow-glass animate-fade-in flex items-start gap-3 rounded-xl border p-4"
          >
            <Icon className={cn("h-5 w-5 flex-shrink-0 mt-0.5", COLORS[t.variant] || COLORS.default)} />
            <div className="flex-1 min-w-0">
              {t.title && <p className="text-sm font-semibold text-primary">{t.title}</p>}
              {t.description && <p className="text-sm text-secondary">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-secondary hover:text-primary">
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
