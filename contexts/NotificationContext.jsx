"use client";

import { createContext } from "react";
import { NotificationReducer } from "@/reducers/NotificationReducer";
import { initialNotifications, DEFAULT_NOTIFICATION_PREFS } from "@/data/notifications";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";
import { generateId } from "@/utils/formatters";

const NotificationContext = createContext(null);
export default NotificationContext;

const initialState = { notifications: initialNotifications, preferences: DEFAULT_NOTIFICATION_PREFS };

export function NotificationProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(
    NotificationReducer,
    initialState,
    STORAGE_KEYS.NOTIFICATIONS
  );

  // `link` is an in-app route the bell dropdown will navigate to on click.
  // Respects the person's notification preferences (Settings → Notifications) —
  // if they've turned a category off, it's silently skipped rather than queued.
  function pushNotification({ title, message, type = "system", link }) {
    const preferences = state.preferences || DEFAULT_NOTIFICATION_PREFS;
    if (preferences[type] === false) return;

    dispatch({
      type: "ADD_NOTIFICATION",
      payload: { id: generateId("notif"), title, message, type, link, read: false, createdAt: new Date().toISOString() },
    });
  }

  function markRead(id) {
    dispatch({ type: "MARK_READ", payload: id });
  }

  function markAllRead() {
    dispatch({ type: "MARK_ALL_READ" });
  }

  function setPreference(type, enabled) {
    dispatch({ type: "SET_PREFERENCE", payload: { type, enabled } });
  }

  const unreadCount = state.notifications.filter((n) => !n.read).length;
  const preferences = { ...DEFAULT_NOTIFICATION_PREFS, ...(state.preferences || {}) };

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        unreadCount,
        preferences,
        pushNotification,
        markRead,
        markAllRead,
        setPreference,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
