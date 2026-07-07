"use client";

import { useContext, useMemo, useState } from "react";
import { Plus, Search, FolderKanban } from "lucide-react";
import ProjectContext from "@/contexts/ProjectContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import { usePermissions } from "@/hooks/usePermissions";
import { MODULES, ACTIONS, ROLES } from "@/utils/rbac";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProjectCard from "./ProjectCard";
import ProjectFormModal from "./ProjectFormModal";
import TeamProductivityPanel from "./TeamProductivityPanel";

export default function ProjectsPage() {
  const { projects, addProject, updateProject, deleteProject, getTasksForUser } = useContext(ProjectContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { can, isDeptScoped } = usePermissions();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const canCreate = can(MODULES.PROJECTS, ACTIONS.CREATE);
  const canEdit = can(MODULES.PROJECTS, ACTIONS.EDIT);
  const canDelete = can(MODULES.PROJECTS, ACTIONS.DELETE);
  const canViewAll = can(MODULES.PROJECTS, ACTIONS.VIEW_ALL);
  const deptScoped = isDeptScoped(MODULES.PROJECTS);

  const visibleProjects = useMemo(() => {
    let list = projects;

    if (deptScoped) {
      list = list.filter((p) => p.departmentId === user.departmentId);
    } else if (!canViewAll) {
      // Regular employees only see projects that contain a task assigned to them.
      const myTasks = getTasksForUser(user.employeeId, user.departmentId);
      const myProjectIds = new Set(myTasks.map((t) => t.projectId));
      list = list.filter((p) => myProjectIds.has(p.id));
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }

    return list;
  }, [projects, deptScoped, canViewAll, search, user, getTasksForUser]);

  function handleSubmit(payload) {
    if (editingProject) {
      updateProject(editingProject.id, payload);
      toast({ title: "Project updated" });
    } else {
      addProject(payload, user.employeeId);
      toast({ title: "Project created", variant: "success" });
    }
    setModalOpen(false);
    setEditingProject(null);
  }

  function handleDelete() {
    deleteProject(confirmId);
    toast({ title: "Project deleted" });
    setConfirmId(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description={`${visibleProjects.length} project${visibleProjects.length === 1 ? "" : "s"} · Kanban boards for cross-department work`}
        actions={canCreate && <Button icon={Plus} onClick={() => { setEditingProject(null); setModalOpen(true); }}>New project</Button>}
      />

      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects..." className="pl-9" />
      </div>

      {user.role === ROLES.MANAGER && <TeamProductivityPanel departmentId={user.departmentId} />}

      {visibleProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description={canCreate ? "Create a project to start organizing tasks on a Kanban board." : "You don't have any tasks assigned in a project yet."}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              canEdit={canEdit}
              canDelete={canDelete}
              onEdit={(p) => { setEditingProject(p); setModalOpen(true); }}
              onDelete={setConfirmId}
            />
          ))}
        </div>
      )}

      <ProjectFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProject(null); }}
        onSubmit={handleSubmit}
        project={editingProject}
      />
      <ConfirmDialog
        open={Boolean(confirmId)}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete project"
        description="This will permanently delete the project and all of its tasks."
      />
    </div>
  );
}
