"use client";

import { useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import ProjectContext from "@/contexts/ProjectContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import NotificationContext from "@/contexts/NotificationContext";
import { usePermissions } from "@/hooks/usePermissions";
import { MODULES, ACTIONS } from "@/utils/rbac";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import { FolderKanban } from "lucide-react";
import KanbanBoard from "./KanbanBoard";
import ProjectFilters from "./ProjectFilters";
import TaskFormModal from "./TaskFormModal";
import TaskDetailModal from "./TaskDetailModal";
import ProjectFormModal from "./ProjectFormModal";
import { PROJECT_STATUS_STYLES } from "./taskMeta";
import { cn } from "@/utils/cn";

export default function ProjectBoardPage({ projectId }) {
  const router = useRouter();
  const {
    getProjectById, getTasksByProject, addTask, updateTask, moveTaskStatus, deleteTask, updateProject, deleteProject,
  } = useContext(ProjectContext);
  const { employees, getEmployeeById } = useContext(EmployeeContext);
  const { departments, getDepartmentById } = useContext(DepartmentContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { pushNotification } = useContext(NotificationContext);
  const { can, isDeptScoped } = usePermissions();

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [confirmTaskId, setConfirmTaskId] = useState(null);
  const [confirmDeleteProject, setConfirmDeleteProject] = useState(false);

  const project = getProjectById(projectId);
  const deptScoped = isDeptScoped(MODULES.PROJECTS);
  const canCreate = can(MODULES.PROJECTS, ACTIONS.CREATE) && (!deptScoped || project?.departmentId === user.departmentId);
  const canEditProject = can(MODULES.PROJECTS, ACTIONS.EDIT) && (!deptScoped || project?.departmentId === user.departmentId);
  const canDeleteProject = can(MODULES.PROJECTS, ACTIONS.DELETE);

  const allTasks = project ? getTasksByProject(project.id) : [];

  const assigneeOptions = useMemo(() => {
    const empOptions = employees
      .filter((e) => allTasks.some((t) => t.assigneeType === "employee" && t.assigneeId === e.id))
      .map((e) => ({ value: `employee-${e.id}`, label: `${e.firstName} ${e.lastName}` }));
    const deptOptions = departments
      .filter((d) => allTasks.some((t) => t.assigneeType === "department" && t.assigneeId === d.id))
      .map((d) => ({ value: `department-${d.id}`, label: `${d.name} (dept.)` }));
    return [...empOptions, ...deptOptions];
  }, [employees, departments, allTasks]);

  const filteredTasks = useMemo(() => {
    let list = allTasks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (priority) list = list.filter((t) => t.priority === priority);
    if (assigneeId) {
      const [type, id] = assigneeId.split("-");
      list = list.filter((t) => t.assigneeType === type && String(t.assigneeId) === id);
    }
    return list;
  }, [allTasks, search, priority, assigneeId]);

  if (!project) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="Project not found"
        description="This project may have been deleted."
        action={<Button variant="secondary" onClick={() => router.push("/projects")}>Back to Projects</Button>}
      />
    );
  }

  function canDragTask(task) {
    if (canCreate || can(MODULES.PROJECTS, ACTIONS.EDIT)) {
      if (!deptScoped || project.departmentId === user.departmentId) return true;
    }
    if (task.assigneeType === "employee" && task.assigneeId === user.employeeId) return true;
    if (task.assigneeType === "department" && task.assigneeId === user.departmentId) return true;
    return false;
  }

  function notifyAssignee(task) {
    const link = `/projects/${project.id}`;
    if (task.assigneeType === "employee") {
      const emp = getEmployeeById(task.assigneeId);
      pushNotification({ title: "New task assigned", message: `"${task.title}" was assigned to you in ${project.name}.`, type: "task", link });
    } else {
      const dept = getDepartmentById(task.assigneeId);
      pushNotification({ title: "New task for your department", message: `"${task.title}" was assigned to ${dept?.name} in ${project.name}.`, type: "task", link });
    }
  }

  function handleTaskSubmit(payload) {
    if (editingTask) {
      updateTask(editingTask.id, payload, user.employeeId);
      toast({ title: "Task updated" });
    } else {
      const created = addTask({ ...payload, projectId: project.id }, user.employeeId);
      notifyAssignee(created);
      toast({ title: "Task created", variant: "success" });
    }
    setTaskModalOpen(false);
    setEditingTask(null);
  }

  function handleMove(taskId, status) {
    moveTaskStatus(taskId, status, user.employeeId);
    toast({ title: "Task moved", description: `Moved to ${status}.`, variant: "success" });
  }

  function handleDeleteTask() {
    deleteTask(confirmTaskId);
    toast({ title: "Task deleted" });
    setConfirmTaskId(null);
    setSelectedTask(null);
  }

  function handleProjectSubmit(payload) {
    updateProject(project.id, payload);
    toast({ title: "Project updated" });
    setProjectModalOpen(false);
  }

  function handleDeleteProject() {
    deleteProject(project.id);
    toast({ title: "Project deleted" });
    router.push("/projects");
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.push("/projects")} className="inline-flex items-center gap-1.5 text-sm text-secondary hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> All projects
      </button>

      <PageHeader
        title={project.name}
        description={project.description}
        actions={
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", PROJECT_STATUS_STYLES[project.status])}>{project.status}</span>
            {canEditProject && (
              <Button size="sm" variant="secondary" icon={Pencil} onClick={() => setProjectModalOpen(true)}>Edit project</Button>
            )}
            {canDeleteProject && (
              <Button size="sm" variant="danger" icon={Trash2} onClick={() => setConfirmDeleteProject(true)}>Delete</Button>
            )}
            {canCreate && (
              <Button icon={Plus} onClick={() => { setEditingTask(null); setTaskModalOpen(true); }}>New task</Button>
            )}
          </div>
        }
      />

      <ProjectFilters
        search={search} onSearch={setSearch}
        priority={priority} onPriority={setPriority}
        assigneeOptions={assigneeOptions} assigneeId={assigneeId} onAssignee={setAssigneeId}
      />

      {filteredTasks.length === 0 ? (
        <EmptyState icon={FolderKanban} title="No tasks match your filters" />
      ) : (
        <KanbanBoard
          tasks={filteredTasks}
          canDragTask={canDragTask}
          onMove={handleMove}
          onTaskClick={setSelectedTask}
        />
      )}

      <TaskFormModal
        open={taskModalOpen}
        onClose={() => { setTaskModalOpen(false); setEditingTask(null); }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        restrictDepartmentId={deptScoped ? user.departmentId : null}
      />

      <TaskDetailModal
        open={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        task={selectedTask ? allTasks.find((t) => t.id === selectedTask.id) || selectedTask : null}
        canEdit={canCreate || can(MODULES.PROJECTS, ACTIONS.EDIT)}
        canDelete={can(MODULES.PROJECTS, ACTIONS.DELETE)}
        onEdit={(task) => { setSelectedTask(null); setEditingTask(task); setTaskModalOpen(true); }}
        onDelete={(id) => setConfirmTaskId(id)}
      />

      <ProjectFormModal
        open={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
        onSubmit={handleProjectSubmit}
        project={project}
      />

      <ConfirmDialog
        open={Boolean(confirmTaskId)}
        onClose={() => setConfirmTaskId(null)}
        onConfirm={handleDeleteTask}
        title="Delete task"
        description="This task and its comments/attachments will be permanently deleted."
      />
      <ConfirmDialog
        open={confirmDeleteProject}
        onClose={() => setConfirmDeleteProject(false)}
        onConfirm={handleDeleteProject}
        title="Delete project"
        description="This will permanently delete the project and all of its tasks."
      />
    </div>
  );
}
