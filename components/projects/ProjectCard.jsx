"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Trash2, Pencil } from "lucide-react";
import DepartmentContext from "@/contexts/DepartmentContext";
import ProjectContext from "@/contexts/ProjectContext";
import { Card, CardBody } from "@/components/ui/Card";
import { PROJECT_STATUS_STYLES } from "./taskMeta";
import { cn } from "@/utils/cn";

export default function ProjectCard({ project, canEdit, canDelete, onEdit, onDelete }) {
  const router = useRouter();
  const { getDepartmentById } = useContext(DepartmentContext);
  const { getTasksByProject } = useContext(ProjectContext);

  const tasks = getTasksByProject(project.id);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  return (
    <Card className="group relative flex flex-col cursor-pointer hover:border-brand transition-colors" onClick={() => router.push(`/projects/${project.id}`)}>
      <CardBody className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand">
            <FolderKanban className="h-5 w-5" />
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {canEdit && (
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(project); }}
                className="rounded-lg p-1.5 text-secondary hover:bg-surface-2 hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(project.id); }}
                className="rounded-lg p-1.5 text-secondary hover:bg-red-500/10 hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <h3 className="mt-3 text-sm font-semibold text-primary line-clamp-1">{project.name}</h3>
        <p className="mt-1 text-xs text-secondary line-clamp-2 flex-1">{project.description}</p>

        <div className="mt-4 flex items-center justify-between text-xs text-secondary">
          <span>{getDepartmentById(project.departmentId)?.name}</span>
          <span className={cn("rounded-full px-2 py-0.5 font-medium", PROJECT_STATUS_STYLES[project.status])}>{project.status}</span>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-secondary mb-1">
            <span>{completed}/{total} tasks done</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-surface-2">
            <div className="h-1.5 rounded-full bg-brand-gradient transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
