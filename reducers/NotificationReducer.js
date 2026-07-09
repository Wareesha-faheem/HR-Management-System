import { createCrudReducer } from "./createCrudReducer";

function addUserToReadBy(readBy = [], userId) {
  if (!userId) return readBy;
  if (readBy.includes(userId)) return readBy;
  return [...readBy, userId];
}

export const NotificationReducer = createCrudReducer("notifications", "NOTIFICATION", {
  MARK_READ: (state, action) => ({
    ...state,
    notifications: state.notifications.map((n) =>
      n.id === action.payload.id
        ? { ...n, readBy: addUserToReadBy(n.readBy, action.payload.userId) }
        : n
    ),
  }),
  MARK_ALL_READ: (state, action) => ({
    ...state,
    notifications: state.notifications.map((n) =>
      action.payload?.notificationIds?.includes(n.id)
        ? { ...n, readBy: addUserToReadBy(n.readBy, action.payload.userId) }
        : n
    ),
  }),
  SET_PREFERENCE: (state, action) => ({
    ...state,
    preferences: { ...state.preferences, [action.payload.type]: action.payload.enabled },
  }),
});
