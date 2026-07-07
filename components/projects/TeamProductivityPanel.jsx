"use client";

import { useContext, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import ProjectContext from "@/contexts/ProjectContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import { isOverdue } from "./taskMeta";
import { cn } from "@/utils/cn";

// Manager-only view: how each of their own employees is doing across every
// project in the department. Intentionally lightweight (no charts/reports
// module) — just completion rate + overdue count per person.
export default function TeamProductivityPanel({ departmentId }) {
  const { projects, tasks } = useContext(ProjectContext);
  const { employees } = useContext(EmployeeContext);

  const rows = useMemo(() => {
    const deptProjectIds = new Set(projects.filter((p) => p.departmentId === departmentId).map((p) => p.id));
    const deptEmployees = employees.filter((e) => e.departmentId === departmentId);

    return deptEmployees
      .map((emp) => {
        const empTasks = tasks.filter(
          (t) => deptProjectIds.has(t.projectId) && t.assigneeType === "employee" && t.assigneeId === emp.id
        );
        const total = empTasks.length;
        const completed = empTasks.filter((t) => t.status === "Completed").length;
        const inProgress = empTasks.filter((t) => t.status === "In Progress").length;
        const overdue = empTasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
        const rate = total ? Math.round((completed / total) * 100) : 0;
        return { emp, total, completed, inProgress, overdue, rate };
      })
      .sort((a, b) => b.total - a.total);
  }, [projects, tasks, employees, departmentId]);

  if (rows.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand" /> Team productivity</CardTitle>
        <span className="text-xs text-secondary">Task completion across all of your projects</span>
      </CardHeader>
      <CardBody className="space-y-3">
        {rows.map(({ emp, total, completed, overdue, rate }) => (
          <div key={emp.id} className="flex items-center gap-3">
            <Avatar firstName={emp.firstName} lastName={emp.lastName} color={emp.avatarColor} size={32} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-primary truncate">{emp.firstName} {emp.lastName}</p>
                <p className="text-xs text-secondary flex-shrink-0">
                  {total === 0 ? "No tasks yet" : `${completed}/${total} done · ${rate}%`}
                  {overdue > 0 && <span className="ml-2 text-red-500 font-medium">{overdue} overdue</span>}
                </p>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-surface-2">
                <div
                  className={cn("h-1.5 rounded-full transition-all", overdue > 0 ? "bg-red-500" : "bg-brand-gradient")}
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
