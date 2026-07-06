"use client";

import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import PermissionsContext from "@/contexts/PermissionsContext";
import { hasPermission, canAccessRoute, isDeptScoped } from "@/utils/rbac";

// Single entry point every component should use for authorization checks.
// Combines the active session's role with any per-user overrides a Super
// Admin has granted, so callers never touch utils/rbac.js directly.
export function usePermissions() {
  const { user } = useContext(AuthContext);
  const { getOverridesFor } = useContext(PermissionsContext);

  const overrides = user ? getOverridesFor(user.employeeId) : undefined;

  return {
    can: (moduleName, action) => hasPermission(user?.role, moduleName, action, overrides),
    canAccessRoute: (pathname) => canAccessRoute(user?.role, pathname, overrides),
    isDeptScoped: (moduleName) => isDeptScoped(user?.role, moduleName),
    overrides,
  };
}
