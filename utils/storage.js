// Thin wrapper around localStorage that no-ops safely on the server
// and guards against corrupt / missing data.

const isBrowser = typeof window !== "undefined";

export function loadState(key, fallback) {
  if (!isBrowser) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`storage: failed to load "${key}"`, err);
    return fallback;
  }
}

export function saveState(key, value) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`storage: failed to save "${key}"`, err);
  }
}

export function clearState(key) {
  if (!isBrowser) return;
  window.localStorage.removeItem(key);
}

export const STORAGE_KEYS = {
  AUTH: "hrms.auth",
  EMPLOYEES: "hrms.employees",
  DEPARTMENTS: "hrms.departments",
  ATTENDANCE: "hrms.attendance",
  LEAVES: "hrms.leaves",
  PAYROLL: "hrms.payroll",
  CANDIDATES: "hrms.candidates",
  NOTIFICATIONS: "hrms.notifications",
  THEME: "hrms.theme",
  SETTINGS: "hrms.settings",
  PERMISSIONS: "hrms.permissions",
  NOTICES: "hrms.notices",
};
