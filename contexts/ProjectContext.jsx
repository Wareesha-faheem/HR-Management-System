"use client";

import { createContext } from "react";
import { ProjectReducer } from "@/reducers/ProjectReducer";
import { initialProjects } from "@/data/projects";
import { initialTasks } from "@/data/tasks";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";

const ProjectContext = createContext(null);
export default ProjectContext;

const initialState = { projects: initialProjects, tasks: initialTasks };

// NOTE: add PROJECTS: "kuickpay_projects" to STORAGE_KEYS in utils/storage.js
// (same convention as STORAGE_KEYS.CANDIDATES) before wiring this in.
export function ProjectProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(ProjectReducer, initialState, STORAGE_KEYS.PROJECTS);

  function nextId(list) {
    return Math.max(0, ...list.map((x) => x.id)) + 1;
  }

  function logActivity(taskId, type, message, actorId) {
    dispatch({
      type: "ADD_ACTIVITY",
      payload: { taskId, entry: { id: Date.now(), type, message, actorId, at: new Date().toISOString().split("T")[0] } },
    });
  }

  // ---- Projects ----
  function addProject(project, actorId) {
    const payload = { id: nextId(state.projects), status: "Active", createdAt: new Date().toISOString().split("T")[0], createdBy: actorId, ...project };
    dispatch({ type: "ADD_PROJECT", payload });
    return payload;
  }

  function updateProject(id, payload) {
    dispatch({ type: "UPDATE_PROJECT", payload: { id, ...payload } });
  }

  function deleteProject(id) {
    dispatch({ type: "DELETE_PROJECT", payload: id });
  }

  function getProjectById(id) {
    return state.projects.find((p) => p.id === Number(id));
  }

  // ---- Tasks ----
  function addTask(task, actorId) {
    const payload = {
      id: nextId(state.tasks),
      status: "Not Started",
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: actorId,
      comments: [],
      attachments: [],
      activity: [],
      ...task,
    };
    dispatch({ type: "ADD_TASK", payload });
    logActivity(payload.id, "created", "Task created", actorId);
    if (payload.assigneeId) {
      logActivity(payload.id, "assigned", `Assigned on creation`, actorId);
    }
    return payload;
  }

  function updateTask(id, payload, actorId) {
    dispatch({ type: "UPDATE_TASK", payload: { id, ...payload } });
    if (payload.status) logActivity(id, "status", `Moved to ${payload.status}`, actorId);
    if (payload.assigneeId !== undefined) logActivity(id, "assigned", "Assignee changed", actorId);
  }

  function moveTaskStatus(id, status, actorId) {
    updateTask(id, { status }, actorId);
  }

  function deleteTask(id) {
    dispatch({ type: "DELETE_TASK", payload: id });
  }

  function getTasksByProject(projectId) {
    return state.tasks.filter((t) => t.projectId === Number(projectId));
  }

  function getTaskById(id) {
    return state.tasks.find((t) => t.id === Number(id));
  }

  // Tasks visible in "My Tasks": assigned directly to the employee, or to
  // their department as a whole.
  function getTasksForUser(employeeId, departmentId) {
    return state.tasks.filter(
      (t) =>
        (t.assigneeType === "employee" && t.assigneeId === employeeId) ||
        (t.assigneeType === "department" && t.assigneeId === departmentId)
    );
  }

  // ---- Comments ----
  function addComment(taskId, authorId, text) {
    const comment = { id: Date.now(), authorId, text, createdAt: new Date().toISOString() };
    dispatch({ type: "ADD_COMMENT", payload: { taskId, comment } });
    logActivity(taskId, "comment", "Comment added", authorId);
  }

  // ---- Attachments (stored as base64 data URLs, no backend) ----
  function addAttachment(taskId, attachment, actorId) {
    const payload = { id: Date.now(), uploadedAt: new Date().toISOString(), ...attachment };
    dispatch({ type: "ADD_ATTACHMENT", payload: { taskId, attachment: payload } });
    logActivity(taskId, "attachment", `Attached ${attachment.name}`, actorId);
  }

  function deleteAttachment(taskId, attachmentId) {
    dispatch({ type: "DELETE_ATTACHMENT", payload: { taskId, attachmentId } });
  }

  return (
    <ProjectContext.Provider
      value={{
        projects: state.projects,
        tasks: state.tasks,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        addTask,
        updateTask,
        moveTaskStatus,
        deleteTask,
        getTasksByProject,
        getTaskById,
        getTasksForUser,
        addComment,
        addAttachment,
        deleteAttachment,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}
