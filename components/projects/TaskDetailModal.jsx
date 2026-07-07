"use client";

import { useContext } from "react";
import { Pencil, Trash2, CalendarDays } from "lucide-react";
import EmployeeContext from "@/contexts/EmployeeContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import AuthContext from "@/contexts/AuthContext";
import ProjectContext from "@/contexts/ProjectContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import TaskComments from "./TaskComments";
import TaskAttachments from "./TaskAttachments";
import TaskActivityLog from "./TaskActivityLog";
import { PRIORITY_STYLES, isOverdue } from "./taskMeta";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export default function TaskDetailModal({ open, onClose, task, canEdit, canDelete, onEdit, onDelete }) {
  const { getEmployeeById } = useContext(EmployeeContext);
  const { getDepartmentById } = useContext(DepartmentContext);
  const { user } = useContext(AuthContext);
  const { addComment, addAttachment, deleteAttachment } = useContext(ProjectContext);

  if (!task) return null;

  const assignee = task.assigneeType === "employee" ? getEmployeeById(task.assigneeId) : null;
  const assigneeDept = task.assigneeType === "department" ? getDepartmentById(task.assigneeId) : null;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <Modal open={open} onClose={onClose} title={task.title} size="xl">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", PRIORITY_STYLES[task.priority])}>{task.priority} priority</span>
          <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-primary">{task.status}</span>
          {task.dueDate && (
            <span className={cn("flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", overdue ? "bg-red-500/10 text-red-500" : "bg-surface-2 text-secondary")}>
              <CalendarDays className="h-3 w-3" /> Due {formatDate(task.dueDate)}
            </span>
          )}

          {(canEdit || canDelete) && (
            <div className="ml-auto flex items-center gap-1">
              {canEdit && (
                <Button size="sm" variant="secondary" icon={Pencil} onClick={() => onEdit(task)}>Edit</Button>
              )}
              {canDelete && (
                <Button size="sm" variant="danger" icon={Trash2} onClick={() => onDelete(task.id)}>Delete</Button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-[rgb(var(--border-subtle))] p-3">
          {assignee ? (
            <>
              <Avatar firstName={assignee.firstName} lastName={assignee.lastName} color={assignee.avatarColor} size={36} />
              <div>
                <p className="text-sm font-semibold text-primary">{assignee.firstName} {assignee.lastName}</p>
                <p className="text-xs text-secondary">{assignee.designation}</p>
              </div>
            </>
          ) : assigneeDept ? (
            <div>
              <p className="text-sm font-semibold text-primary">{assigneeDept.name}</p>
              <p className="text-xs text-secondary">Assigned to the whole department</p>
            </div>
          ) : (
            <p className="text-sm text-secondary">Unassigned</p>
          )}
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-secondary">Description</p>
          <p className="text-sm text-primary whitespace-pre-wrap">{task.description || "No description provided."}</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">Comments</p>
          <TaskComments comments={task.comments} onAdd={(text) => addComment(task.id, user.employeeId, text)} />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">Attachments</p>
          <TaskAttachments
            attachments={task.attachments}
            canDelete={canEdit}
            onUpload={(file) => addAttachment(task.id, { ...file, uploadedBy: user.employeeId }, user.employeeId)}
            onDelete={(attachmentId) => deleteAttachment(task.id, attachmentId)}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary">Activity</p>
          <TaskActivityLog activity={task.activity} />
        </div>
      </div>
    </Modal>
  );
}
