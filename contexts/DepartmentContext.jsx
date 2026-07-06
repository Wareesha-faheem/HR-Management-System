"use client";

import { createContext } from "react";
import { DepartmentReducer } from "@/reducers/DepartmentReducer";
import { initialDepartments } from "@/data/departments";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";

const DepartmentContext = createContext(null);
export default DepartmentContext;

const initialState = { departments: initialDepartments };

export function DepartmentProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(DepartmentReducer, initialState, STORAGE_KEYS.DEPARTMENTS);

  function addDepartment(department) {
    const nextId = Math.max(0, ...state.departments.map((d) => d.id)) + 1;
    dispatch({ type: "ADD_DEPARTMENT", payload: { id: nextId, ...department } });
  }

  function updateDepartment(id, payload) {
    dispatch({ type: "UPDATE_DEPARTMENT", payload: { id, ...payload } });
  }

  function deleteDepartment(id) {
    dispatch({ type: "DELETE_DEPARTMENT", payload: id });
  }

  function getDepartmentById(id) {
    return state.departments.find((d) => d.id === Number(id) || d.id === id);
  }

  return (
    <DepartmentContext.Provider
      value={{
        departments: state.departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        getDepartmentById,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
}
