// Centralized Role-Based Access Control.
// Every route guard and conditional UI check in the app should go through
// the helpers exported here instead of inlining role checks.
//
// Two layers on top of a plain role:
//  1. Department scoping — a Manager's "view all" style permissions are
//     restricted to their own department's data (see isDeptScoped()).
//  2. Per-user overrides — a Super Admin can grant or revoke a specific
//     action for a specific person regardless of their role (see
//     contexts/PermissionsContext.jsx + hooks/usePermissions.js). Pass the
//     overrides object into hasPermission()/canAccessRoute() to apply it;
//     omit it to get a pure role-based answer.

export const ROLES = {
  SUPER_ADMIN: "Super Admin",
  HR: "HR",
  MANAGER: "Manager",
  PAYROLL_MANAGER: "Payroll Manager",
  EMPLOYEE: "Employee",
};

export const MODULES = {
  DASHBOARD: "dashboard",
  EMPLOYEES: "employees",
  DEPARTMENTS: "departments",
  ATTENDANCE: "attendance",
  LEAVE: "leave",
  PAYROLL: "payroll",
  RECRUITMENT: "recruitment",
  REPORTS: "reports",
  SETTINGS: "settings",
  NOTICES: "notices",
};

export const ACTIONS = {
  VIEW: "view",
  VIEW_ALL: "viewAll",
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  APPROVE: "approve",
  EXPORT: "export",
  ASSIGN_ROLE: "assignRole",       // elevate someone to HR / Manager / Payroll Manager / Super Admin
  MANAGE_PERMISSIONS: "managePermissions", // grant per-user custom overrides
  MANAGE_SETTINGS: "manageSettings",       // system-wide configuration
  REQUISITION: "requisition",      // recruitment: Manager raises a hiring request
  INTERVIEW: "interview",          // recruitment: conduct interview / move to Interview stage
  FINALIZE: "finalize",            // recruitment: offer / hire / reject
  POST_COMPANY: "postCompany",     // notices: company-wide
  POST_DEPARTMENT: "postDepartment", // notices: department-wide
};

const { SUPER_ADMIN, HR, MANAGER, PAYROLL_MANAGER, EMPLOYEE } = ROLES;
const ALL_ROLES = [SUPER_ADMIN, HR, MANAGER, PAYROLL_MANAGER, EMPLOYEE];

// permission matrix: module -> action -> roles allowed (role-level, before overrides)
const PERMISSIONS = {
  [MODULES.DASHBOARD]: {
    [ACTIONS.VIEW]: ALL_ROLES,
  },
  [MODULES.EMPLOYEES]: {
    [ACTIONS.VIEW]: [SUPER_ADMIN, HR, MANAGER],       // Manager: own department only (see isDeptScoped)
    [ACTIONS.VIEW_ALL]: [SUPER_ADMIN, HR],
    [ACTIONS.CREATE]: [SUPER_ADMIN, HR],
    [ACTIONS.EDIT]: [SUPER_ADMIN, HR],
    [ACTIONS.DELETE]: [SUPER_ADMIN],
    [ACTIONS.EXPORT]: [SUPER_ADMIN, HR],
    [ACTIONS.ASSIGN_ROLE]: [SUPER_ADMIN],              // only Super Admin can create/promote HR, Manager, Payroll Manager, Super Admin accounts
  },
  [MODULES.DEPARTMENTS]: {
    [ACTIONS.VIEW]: ALL_ROLES,
    [ACTIONS.CREATE]: [SUPER_ADMIN, HR],
    [ACTIONS.EDIT]: [SUPER_ADMIN, HR],
    [ACTIONS.DELETE]: [SUPER_ADMIN],
  },
  [MODULES.ATTENDANCE]: {
    [ACTIONS.VIEW]: ALL_ROLES,                         // personal check-in/out + own history
    [ACTIONS.VIEW_ALL]: [SUPER_ADMIN, HR, MANAGER],    // Manager: own department only
    [ACTIONS.EDIT]: [SUPER_ADMIN, HR],
    [ACTIONS.DELETE]: [SUPER_ADMIN, HR],
    [ACTIONS.EXPORT]: [SUPER_ADMIN, HR, MANAGER],
  },
  [MODULES.LEAVE]: {
    [ACTIONS.VIEW]: ALL_ROLES,
    [ACTIONS.VIEW_ALL]: [SUPER_ADMIN, HR, MANAGER],    // Manager: own department only
    [ACTIONS.CREATE]: ALL_ROLES,
    [ACTIONS.APPROVE]: [SUPER_ADMIN, HR, MANAGER],     // Manager: own department only
    [ACTIONS.DELETE]: [SUPER_ADMIN, HR],
  },
  [MODULES.PAYROLL]: {
    [ACTIONS.VIEW]: ALL_ROLES,                         // personal payslips
    [ACTIONS.VIEW_ALL]: [SUPER_ADMIN, HR, PAYROLL_MANAGER],
    [ACTIONS.CREATE]: [SUPER_ADMIN, PAYROLL_MANAGER],
    [ACTIONS.EDIT]: [SUPER_ADMIN, PAYROLL_MANAGER],    // process salary runs, mark paid
    [ACTIONS.DELETE]: [SUPER_ADMIN],
    [ACTIONS.EXPORT]: [SUPER_ADMIN, HR, PAYROLL_MANAGER],
  },
  [MODULES.RECRUITMENT]: {
    [ACTIONS.VIEW]: [SUPER_ADMIN, HR, MANAGER],        // Manager: own department only
    [ACTIONS.REQUISITION]: [SUPER_ADMIN, HR, MANAGER], // Manager raises the hiring request
    [ACTIONS.CREATE]: [SUPER_ADMIN, HR],               // HR creates the job posting / adds candidates
    [ACTIONS.INTERVIEW]: [SUPER_ADMIN, HR, MANAGER],   // Manager conducts interviews
    [ACTIONS.FINALIZE]: [SUPER_ADMIN, HR],             // HR prepares offer / hires / rejects
    [ACTIONS.EDIT]: [SUPER_ADMIN, HR],
    [ACTIONS.DELETE]: [SUPER_ADMIN, HR],
  },
  [MODULES.REPORTS]: {
    [ACTIONS.VIEW]: [SUPER_ADMIN, HR, MANAGER, PAYROLL_MANAGER],
    [ACTIONS.EXPORT]: [SUPER_ADMIN, HR, PAYROLL_MANAGER],
  },
  [MODULES.SETTINGS]: {
    [ACTIONS.VIEW]: ALL_ROLES,                         // personal profile / appearance
    [ACTIONS.MANAGE_SETTINGS]: [SUPER_ADMIN],
    [ACTIONS.MANAGE_PERMISSIONS]: [SUPER_ADMIN],
  },
  [MODULES.NOTICES]: {
    [ACTIONS.VIEW]: ALL_ROLES,
    [ACTIONS.POST_COMPANY]: [SUPER_ADMIN, HR],
    [ACTIONS.POST_DEPARTMENT]: [SUPER_ADMIN, HR, MANAGER],
    [ACTIONS.DELETE]: [SUPER_ADMIN, HR],
  },
};

// route -> module, used for route-level guards
export const ROUTE_MODULE_MAP = {
  "/dashboard": MODULES.DASHBOARD,
  "/employees": MODULES.EMPLOYEES,
  "/departments": MODULES.DEPARTMENTS,
  "/attendance": MODULES.ATTENDANCE,
  "/leave": MODULES.LEAVE,
  "/payroll": MODULES.PAYROLL,
  "/recruitment": MODULES.RECRUITMENT,
  "/reports": MODULES.REPORTS,
  "/settings": MODULES.SETTINGS,
};

// Modules where a Manager's permission is implicitly restricted to their
// own department's records rather than the whole company.
const DEPARTMENT_SCOPED_FOR_MANAGER = [
  MODULES.EMPLOYEES,
  MODULES.ATTENDANCE,
  MODULES.LEAVE,
  MODULES.RECRUITMENT,
];

export function isDeptScoped(role, moduleName) {
  return role === MANAGER && DEPARTMENT_SCOPED_FOR_MANAGER.includes(moduleName);
}

// `overrides` (optional) is a per-user object shaped like:
//   { [moduleName]: { [action]: true | false } }
// An explicit true/false always wins over the role matrix, letting a
// Super Admin grant a one-off capability to someone (e.g. let a specific
// Manager finalize hires) or revoke a capability their role would normally
// have.
export function hasPermission(role, moduleName, action = ACTIONS.VIEW, overrides) {
  if (!role) return false;

  const override = overrides?.[moduleName]?.[action];
  if (override === true) return true;
  if (override === false) return false;

  const modulePerms = PERMISSIONS[moduleName];
  if (!modulePerms) return false;
  const allowedRoles = modulePerms[action];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

export function canAccessRoute(role, pathname, overrides) {
  const matchedRoute = Object.keys(ROUTE_MODULE_MAP).find((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  if (!matchedRoute) return true;
  return hasPermission(role, ROUTE_MODULE_MAP[matchedRoute], ACTIONS.VIEW, overrides);
}

export function isAdmin(role) {
  return role === SUPER_ADMIN;
}

export function isHRorAbove(role) {
  return role === SUPER_ADMIN || role === HR;
}

export function isManagerOrAbove(role) {
  return role === SUPER_ADMIN || role === HR || role === MANAGER;
}

// Roles a Super Admin is allowed to assign to someone via the Employees form.
export const ASSIGNABLE_ROLES = Object.values(ROLES);

// Nav items are centrally defined here so the sidebar never inlines role checks.
export function getAccessibleNavItems(role, overrides) {
  const items = [
    { key: MODULES.DASHBOARD, label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { key: MODULES.EMPLOYEES, label: "Employees", href: "/employees", icon: "Users" },
    { key: MODULES.DEPARTMENTS, label: "Departments", href: "/departments", icon: "Building2" },
    { key: MODULES.ATTENDANCE, label: "Attendance", href: "/attendance", icon: "Fingerprint" },
    { key: MODULES.LEAVE, label: "Leave", href: "/leave", icon: "CalendarDays" },
    { key: MODULES.PAYROLL, label: "Payroll", href: "/payroll", icon: "Wallet" },
    { key: MODULES.RECRUITMENT, label: "Recruitment", href: "/recruitment", icon: "BriefcaseBusiness" },
    { key: MODULES.REPORTS, label: "Reports", href: "/reports", icon: "BarChart3" },
    { key: MODULES.SETTINGS, label: "Settings", href: "/settings", icon: "Settings" },
  ];
  return items.filter((item) => hasPermission(role, item.key, ACTIONS.VIEW, overrides));
}
