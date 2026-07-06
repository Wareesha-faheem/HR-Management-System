import { createCrudReducer } from "./createCrudReducer";

export const NotificationReducer = createCrudReducer("notifications", "NOTIFICATION", {
  MARK_READ: (state, action) => ({
    ...state,
    notifications: state.notifications.map((n) =>
      n.id === action.payload ? { ...n, read: true } : n
    ),
  }),
  MARK_ALL_READ: (state) => ({
    ...state,
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
  }),
  SET_PREFERENCE: (state, action) => ({
    ...state,
    preferences: { ...state.preferences, [action.payload.type]: action.payload.enabled },
  }),
});
