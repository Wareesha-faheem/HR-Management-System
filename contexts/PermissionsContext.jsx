"use client";

import { createContext, useState, useEffect } from "react";
import { loadState, saveState, STORAGE_KEYS } from "@/utils/storage";

// Per-employee permission overrides granted by a Super Admin, layered on
// top of the role-based matrix in utils/rbac.js. Shape:
//   { [employeeId]: { [module]: { [action]: true | false } } }
const PermissionsContext = createContext(null);
export default PermissionsContext;

export function PermissionsProvider({ children }) {
  const [overridesMap, setOverridesMap] = useState({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persisted = loadState(STORAGE_KEYS.PERMISSIONS, null);
    if (persisted) setOverridesMap(persisted);
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) saveState(STORAGE_KEYS.PERMISSIONS, overridesMap);
  }, [overridesMap, ready]);

  function setOverride(employeeId, moduleName, action, value) {
    setOverridesMap((prev) => {
      const empOverrides = { ...(prev[employeeId] || {}) };
      const moduleOverrides = { ...(empOverrides[moduleName] || {}) };

      if (value === null) {
        delete moduleOverrides[action];
      } else {
        moduleOverrides[action] = value;
      }

      if (Object.keys(moduleOverrides).length === 0) {
        delete empOverrides[moduleName];
      } else {
        empOverrides[moduleName] = moduleOverrides;
      }

      const next = { ...prev };
      if (Object.keys(empOverrides).length === 0) {
        delete next[employeeId];
      } else {
        next[employeeId] = empOverrides;
      }
      return next;
    });
  }

  function clearOverridesFor(employeeId) {
    setOverridesMap((prev) => {
      const next = { ...prev };
      delete next[employeeId];
      return next;
    });
  }

  function getOverridesFor(employeeId) {
    return overridesMap[employeeId] || {};
  }

  return (
    <PermissionsContext.Provider value={{ overridesMap, setOverride, clearOverridesFor, getOverridesFor }}>
      {children}
    </PermissionsContext.Provider>
  );
}
