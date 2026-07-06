"use client";

import { createContext, useContext, useEffect, useState } from "react";
import EmployeeContext from "@/contexts/EmployeeContext";
import { initialUsers } from "@/data/users";
import { loadState, saveState, clearState, STORAGE_KEYS } from "@/utils/storage";
import { ROLES } from "@/utils/rbac";

const AuthContext = createContext(null);
export default AuthContext;

// NOTE: this provider must be mounted INSIDE <EmployeeProvider> (see
// AppProviders.jsx) since it reads employee records to build the session —
// the employee record is the single source of truth for name/role/department,
// so promoting someone in the Employees module takes effect immediately.
export function AuthProvider({ children }) {
  const { getEmployeeById, updateEmployee } = useContext(EmployeeContext);

  const [authEmployeeId, setAuthEmployeeId] = useState(null); // the real, logged-in person
  const [impersonatedId, setImpersonatedId] = useState(null); // Super Admin "view as" target
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const persisted = loadState(STORAGE_KEYS.AUTH, null);
    if (persisted?.employeeId) setAuthEmployeeId(persisted.employeeId);
    setLoading(false);
  }, []);

  function buildSessionUser(employeeId) {
    const employee = getEmployeeById(employeeId);
    if (!employee) return null;
    return {
      employeeId: employee.id,
      email: employee.email,
      role: employee.role,
      firstName: employee.firstName,
      lastName: employee.lastName,
      departmentId: employee.departmentId,
      designation: employee.designation,
      avatarColor: employee.avatarColor,
    };
  }

  const realUser = authEmployeeId != null ? buildSessionUser(authEmployeeId) : null;
  const user = impersonatedId != null ? buildSessionUser(impersonatedId) : realUser;
  const isImpersonating = impersonatedId != null;

  function login(email, password) {
    setError("");
    const match = initialUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!match) {
      setError("Invalid email or password. Try password123 with any seed email.");
      return { success: false, error: "Invalid credentials" };
    }

    setAuthEmployeeId(match.employeeId);
    saveState(STORAGE_KEYS.AUTH, { employeeId: match.employeeId });
    return { success: true };
  }

  function logout() {
    setAuthEmployeeId(null);
    setImpersonatedId(null);
    clearState(STORAGE_KEYS.AUTH);
  }

  function updateProfile(partial) {
    if (authEmployeeId != null) updateEmployee(authEmployeeId, partial);
  }

  // Super Admin only: preview the app exactly as another employee/manager
  // would see it — same role, same department scoping, same nav. Exiting
  // always returns control to the real admin session.
  function startImpersonation(employeeId) {
    if (realUser?.role !== ROLES.SUPER_ADMIN) return;
    setImpersonatedId(employeeId);
  }

  function stopImpersonation() {
    setImpersonatedId(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        realUser,
        isImpersonating,
        loading,
        error,
        login,
        logout,
        updateProfile,
        startImpersonation,
        stopImpersonation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
