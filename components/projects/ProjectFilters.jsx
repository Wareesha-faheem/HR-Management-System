"use client";

import { Search } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { TASK_PRIORITIES } from "@/data/tasks";

export default function ProjectFilters({ search, onSearch, priority, onPriority, assigneeOptions, assigneeId, onAssignee }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
        <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search tasks..." className="pl-9" />
      </div>
      <Select
        value={priority} onChange={(e) => onPriority(e.target.value)}
        options={TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
        placeholder="All priorities"
        className="sm:w-44"
      />
      <Select
        value={assigneeId} onChange={(e) => onAssignee(e.target.value)}
        options={assigneeOptions}
        placeholder="All assignees"
        className="sm:w-52"
      />
    </div>
  );
}
