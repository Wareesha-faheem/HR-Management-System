function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeUser(user) {
  if (!user) return null;
  if (typeof user === "number" || typeof user === "string") {
    const numericId = Number(user);
    return { employeeId: Number.isNaN(numericId) ? null : numericId, id: Number.isNaN(numericId) ? null : numericId, role: null, departmentId: null };
  }
  return {
    employeeId: user.employeeId ?? user.id ?? null,
    id: user.id ?? user.employeeId ?? null,
    role: user.role ?? null,
    departmentId: user.departmentId ?? user.department?.id ?? null,
  };
}

function normalizeUserId(user) {
  return normalizeUser(user)?.employeeId ?? null;
}

function normalizeTarget(notification = {}) {
  return {
    audience: notification.audience || "all",
    roles: toArray(notification.roles),
    departmentIds: toArray(notification.departmentIds),
    userIds: toArray(notification.userIds),
  };
}

function isNotificationVisible(notification = {}, user) {
  const normalizedUser = normalizeUser(user);
  if (!normalizedUser) return false;

  const { audience, roles, departmentIds, userIds } = normalizeTarget(notification);

  switch (audience) {
    case "roles":
      return roles.includes(normalizedUser.role);
    case "departments":
      return departmentIds.some((departmentId) => String(departmentId) === String(normalizedUser.departmentId));
    case "users":
      return userIds.some((userId) => String(userId) === String(normalizedUser.employeeId));
    case "all":
    default:
      return true;
  }
}

function getVisibleNotifications(notifications = [], user) {
  return (notifications || [])
    .filter((notification) => isNotificationVisible(notification, user))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function isNotificationRead(notification = {}, user) {
  const userId = normalizeUserId(user);
  if (!userId) return Boolean(notification.read);
  if (Array.isArray(notification.readBy)) {
    return notification.readBy.includes(userId);
  }
  return Boolean(notification.read);
}

function markNotificationRead(notification = {}, user) {
  const userId = normalizeUserId(user);
  if (!userId) return notification;
  const readBy = Array.isArray(notification.readBy) ? notification.readBy : [];
  return {
    ...notification,
    readBy: readBy.includes(userId) ? readBy : [...readBy, userId],
  };
}

module.exports = {
  normalizeTarget,
  normalizeUser,
  getVisibleNotifications,
  isNotificationVisible,
  isNotificationRead,
  markNotificationRead,
};
