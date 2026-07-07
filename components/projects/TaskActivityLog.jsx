"use client";

import { useContext } from "react";
import { PlusCircle, ArrowRightCircle, UserCheck, MessageSquare, Paperclip, History } from "lucide-react";
import EmployeeContext from "@/contexts/EmployeeContext";
import { formatDate } from "@/utils/formatters";

const ICONS = {
  created: PlusCircle,
  status: ArrowRightCircle,
  assigned: UserCheck,
  comment: MessageSquare,
  attachment: Paperclip,
};

export default function TaskActivityLog({ activity }) {
  const { getEmployeeById } = useContext(EmployeeContext);
  const sorted = [...activity].sort((a, b) => new Date(b.at) - new Date(a.at));

  if (sorted.length === 0) {
    return <p className="text-xs text-secondary">No activity yet.</p>;
  }

  return (
    <div className="space-y-3">
      {sorted.map((entry) => {
        const Icon = ICONS[entry.type] || History;
        const actor = getEmployeeById(entry.actorId);
        return (
          <div key={entry.id} className="flex items-start gap-2.5">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-surface-2 text-secondary">
              <Icon className="h-3.5 w-3.5" />
            </span>
            <p className="text-xs text-secondary">
              <span className="font-medium text-primary">{actor ? `${actor.firstName} ${actor.lastName}` : "Someone"}</span>{" "}
              {entry.message.charAt(0).toLowerCase() + entry.message.slice(1)} · {formatDate(entry.at)}
            </p>
          </div>
        );
      })}
    </div>
  );
}
