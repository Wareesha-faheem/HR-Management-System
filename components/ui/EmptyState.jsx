"use client";

import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title = "Nothing here yet", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient-soft text-brand">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-semibold text-primary">{title}</p>
        {description && <p className="mt-1 text-sm text-secondary max-w-sm">{description}</p>}
      </div>
      {action}
    </div>
  );
}
