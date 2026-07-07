"use client";

import { useContext, useMemo, useState } from "react";
import ProjectContext from "@/contexts/ProjectContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";

import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import Select from "@/components/ui/Select";
import TaskDetailModal from "./TaskDetailModal";
import { PRIORITY_STYLES, isOverdue } from "./taskMeta";
import { TASK_STATUSES } from "@/data/tasks";
import { formatDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export default function MyTasksPage() {
  const { tasks, getProjectById, getTasksForUser, moveTaskStatus } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const [selectedTask, setSelectedTask] = useState(null);

  const myTasks = useMemo(
    () => getTasksForUser(user.employeeId, user.departmentId),
    [tasks, user.employeeId, user.departmentId, getTasksForUser]
  );

  function handleStatusChange(taskId, status) {
    moveTaskStatus(taskId, status, user.employeeId);
    toast({ title: "Task moved", description: `Moved to ${status}.`, variant: "success" });
  }

  const columns = [
    {
      key: "title",
      header: "Task",
      sortable: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="font-medium text-primary truncate">{row.title}</p>
          <p className="text-xs text-secondary truncate">{getProjectById(row.projectId)?.name}</p>
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (row) => <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", PRIORITY_STYLES[row.priority])}>{row.priority}</span>,
    },
    {
      key: "dueDate",
      header: "Due date",
      sortable: true,
      render: (row) => (
        <span className={isOverdue(row.dueDate, row.status) ? "text-red-500 font-medium" : ""}>{formatDate(row.dueDate)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Select
          value={row.status}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          options={TASK_STATUSES.map((s) => ({ value: s, label: s }))}
          className="h-8 text-xs"
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="My Tasks" description={`${myTasks.length} task${myTasks.length === 1 ? "" : "s"} assigned to you, across all projects`} />

      <DataTable
        columns={columns}
        data={myTasks}
        searchKeys={["title", "description"]}
        searchPlaceholder="Search my tasks..."
        emptyTitle="No tasks assigned"
        emptyDescription="Tasks assigned to you or your department will show up here."
        onRowClick={setSelectedTask}
      />

      <TaskDetailModal
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask ? tasks.find((t) => t.id === selectedTask.id) || selectedTask : null}
        canEdit={false}
        canDelete={false}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
