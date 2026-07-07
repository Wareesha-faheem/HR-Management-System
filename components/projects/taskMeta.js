export const PRIORITY_STYLES = {
  Low: "bg-emerald-500/10 text-emerald-500",
  Medium: "bg-sky-500/10 text-sky-500",
  High: "bg-amber-500/10 text-amber-500",
  Urgent: "bg-red-500/10 text-red-500",
};

export const STATUS_COLUMN_STYLES = {
  "Not Started": "border-t-slate-400",
  "In Progress": "border-t-sky-500",
  Review: "border-t-amber-500",
  Completed: "border-t-emerald-500",
};

export const PROJECT_STATUS_STYLES = {
  Active: "bg-emerald-500/10 text-emerald-500",
  "On Hold": "bg-amber-500/10 text-amber-500",
  Completed: "bg-sky-500/10 text-sky-500",
};

export function isOverdue(dueDate, status) {
  if (!dueDate || status === "Completed") return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}
