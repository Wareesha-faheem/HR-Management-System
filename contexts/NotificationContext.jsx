"use client";

import { createContext, useContext, useMemo } from "react";
import AuthContext from "@/contexts/AuthContext";
import { NotificationReducer } from "@/reducers/NotificationReducer";
import { initialNotifications, DEFAULT_NOTIFICATION_PREFS } from "@/data/notifications";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";
import { generateId } from "@/utils/formatters";
import notificationUtils from "@/utils/notifications";

const NotificationContext = createContext(null);
export default NotificationContext;

const initialState = { notifications: initialNotifications, preferences: DEFAULT_NOTIFICATION_PREFS };

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [state, dispatch] = usePersistedReducer(
    NotificationReducer,
    initialState,
    STORAGE_KEYS.NOTIFICATIONS
  );

  const currentUserId = user?.employeeId ?? user?.id ?? null;
  const visibleNotifications = useMemo(() => {
    const filtered = notificationUtils.getVisibleNotifications(state.notifications, user);
    return filtered.map((notification) => ({
      ...notification,
      read: notificationUtils.isNotificationRead(notification, user),
    }));
  }, [state.notifications, user]);

  // `link` is an in-app route the bell dropdown will navigate to on click.
  // Respects the person's notification preferences (Settings → Notifications) —
  // if they've turned a category off, it's silently skipped rather than queued.
  function pushNotification({ title, message, type = "system", link, audience = "all", roles = [], departmentIds = [], userIds = [] }) {
    const preferences = state.preferences || DEFAULT_NOTIFICATION_PREFS;
    if (preferences[type] === false) return;

    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: generateId("notif"),
        title,
        message,
        type,
        link,
        audience,
        roles,
        departmentIds,
        userIds,
        readBy: [],
        createdAt: new Date().toISOString(),
      },
    });
  }

  function markRead(id) {
    if (!currentUserId) return;
    dispatch({ type: "MARK_READ", payload: { id, userId: currentUserId } });
  }

  function markAllRead() {
    if (!currentUserId || visibleNotifications.length === 0) return;
    dispatch({
      type: "MARK_ALL_READ",
      payload: { userId: currentUserId, notificationIds: visibleNotifications.map((n) => n.id) },
    });
  }

  function setPreference(type, enabled) {
    dispatch({ type: "SET_PREFERENCE", payload: { type, enabled } });
  }

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;
  const preferences = { ...DEFAULT_NOTIFICATION_PREFS, ...(state.preferences || {}) };

  return (
    <NotificationContext.Provider
      value={{
        notifications: visibleNotifications,
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
