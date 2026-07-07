// Mirrors RecruitmentReducer's shape: one reducer owning two related slices
// (projects + tasks) so the whole module persists as a single localStorage
// entry, same pattern as candidates+requisitions.
export function ProjectReducer(state, action) {
  switch (action.type) {
    case "__HYDRATE__":
      return {
        ...state,
        ...(action.payload || {}),
        projects: Array.isArray(action.payload?.projects) ? action.payload.projects : state.projects,
        tasks: Array.isArray(action.payload?.tasks) ? action.payload.tasks : state.tasks,
      };

    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] };

    case "UPDATE_PROJECT":
      return {
        ...state,
        projects: state.projects.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p)),
      };

    case "DELETE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
        tasks: state.tasks.filter((t) => t.projectId !== action.payload),
      };

    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t)),
      };

    case "DELETE_TASK":
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };

    case "ADD_COMMENT":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId ? { ...t, comments: [...t.comments, action.payload.comment] } : t
        ),
      };

    case "ADD_ATTACHMENT":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId ? { ...t, attachments: [...t.attachments, action.payload.attachment] } : t
        ),
      };

    case "DELETE_ATTACHMENT":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId
            ? { ...t, attachments: t.attachments.filter((a) => a.id !== action.payload.attachmentId) }
            : t
        ),
      };

    case "ADD_ACTIVITY":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId ? { ...t, activity: [...t.activity, action.payload.entry] } : t
        ),
      };

    default:
      return state;
  }
}
