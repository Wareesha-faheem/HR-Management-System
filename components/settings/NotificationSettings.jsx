"use client";

import { useContext } from "react";
import NotificationContext from "@/contexts/NotificationContext";
import { NOTIFICATION_TYPE_LABELS } from "@/data/notifications";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { cn } from "@/utils/cn";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 flex-shrink-0 rounded-full transition-colors",
        checked ? "bg-brand-gradient" : "bg-surface-2 border border-[rgb(var(--border-subtle))]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function NotificationSettings() {
  const { preferences, setPreference } = useContext(NotificationContext);

  return (
    <Card>
      <CardHeader><CardTitle>Notifications</CardTitle></CardHeader>
      <CardBody className="space-y-1">
        <p className="text-sm text-secondary mb-2">
          Choose which events add a notification to your bell dropdown. Turned-off categories are
          simply skipped — this doesn't affect anyone else's notifications.
        </p>
        {Object.entries(NOTIFICATION_TYPE_LABELS).map(([type, label]) => (
          <div key={type} className="flex items-center justify-between gap-4 py-2.5 border-b border-[rgb(var(--border-subtle))] last:border-0">
            <span className="text-sm text-primary">{label}</span>
            <Toggle checked={preferences[type] !== false} onChange={() => setPreference(type, !(preferences[type] !== false))} />
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
