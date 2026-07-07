"use client";

import { useContext } from "react";
import { MessageSquare, Paperclip, AlertCircle } from "lucide-react";
import EmployeeContext from "@/contexts/EmployeeContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import Avatar from "@/components/ui/Avatar";
import { PRIORITY_STYLES, isOverdue } from "./taskMeta";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export default function TaskCard({ task, draggable, onDragStart, onClick }) {
  const { getEmployeeById } = useContext(EmployeeContext);
  const { getDepartmentById } = useContext(DepartmentContext);

  const assignee = task.assigneeType === "employee" ? getEmployeeById(task.assigneeId) : null;
  const assigneeDept = task.assigneeType === "department" ? getDepartmentById(task.assigneeId) : null;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      draggable={draggable}
      onDragStart={() => onDragStart(task.id)}
      onClick={onClick}
      className={cn(
        "rounded-xl border border-[rgb(var(--border-subtle))] bg-surface p-3 transition-colors",
        draggable ? "cursor-grab active:cursor-grabbing hover:border-brand" : "opacity-90",
        "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-primary line-clamp-2">{task.title}</p>
        <span className={cn("flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold", PRIORITY_STYLES[task.priority])}>
          {task.priority}
        </span>
      </div>

      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          {assignee ? (
            <>
              <Avatar firstName={assignee.firstName} lastName={assignee.lastName} color={assignee.avatarColor} size={22} />
              <span className="text-xs text-secondary truncate">{assignee.firstName} {assignee.lastName}</span>
            </>
          ) : assigneeDept ? (
            <span className="text-xs text-secondary truncate">{assigneeDept.name} dept.</span>
          ) : (
            <span className="text-xs text-secondary/60">Unassigned</span>
          )}
        </div>
        {task.dueDate && (
          <span className={cn("flex items-center gap-1 text-[11px] flex-shrink-0", overdue ? "text-red-500" : "text-secondary")}>
            {overdue && <AlertCircle className="h-3 w-3" />}
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>

      {(task.comments.length > 0 || task.attachments.length > 0) && (
        <div className="mt-2 flex items-center gap-3 text-[11px] text-secondary">
          {task.comments.length > 0 && (
            <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />{task.comments.length}</span>
          )}
          {task.attachments.length > 0 && (
            <span className="flex items-center gap-1"><Paperclip className="h-3 w-3" />{task.attachments.length}</span>
          )}
        </div>
      )}
    </div>
  );
}
