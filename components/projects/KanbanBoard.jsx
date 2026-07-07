"use client";

import { useState } from "react";
import TaskCard from "./TaskCard";
import { TASK_STATUSES } from "@/data/tasks";
import { STATUS_COLUMN_STYLES } from "./taskMeta";
import { cn } from "@/utils/cn";

export default function KanbanBoard({ tasks, canDragTask, onMove, onTaskClick }) {
  const [dragId, setDragId] = useState(null);

  function handleDrop(status) {
    if (dragId == null) return;
    onMove(dragId, status);
    setDragId(null);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {TASK_STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(status)}
            className={cn("rounded-xl2 border border-t-4 bg-surface-2/50 p-3 min-h-[280px]", STATUS_COLUMN_STYLES[status])}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">{status}</p>
              <span className="text-xs text-secondary bg-surface rounded-full px-2 py-0.5">{columnTasks.length}</span>
            </div>

            <div className="space-y-2.5">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  draggable={canDragTask(task)}
                  onDragStart={setDragId}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
