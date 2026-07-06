"use client";

import { createContext } from "react";
import { EmployeeReducer } from "@/reducers/EmployeeReducer";
import { initialEmployees } from "@/data/employees";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";
import { generateId } from "@/utils/formatters";

const EmployeeContext = createContext(null);
export default EmployeeContext;

const initialState = { employees: initialEmployees };

export function EmployeeProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(EmployeeReducer, initialState, STORAGE_KEYS.EMPLOYEES);

  function addEmployee(employee) {
    const nextId = Math.max(0, ...state.employees.map((e) => e.id)) + 1;
    dispatch({
      type: "ADD_EMPLOYEE",
      payload: { id: nextId, joinDate: new Date().toISOString().split("T")[0], ...employee },
    });
    return nextId;
  }

  function updateEmployee(id, payload) {
    dispatch({ type: "UPDATE_EMPLOYEE", payload: { id, ...payload } });
  }

  function deleteEmployee(id) {
    dispatch({ type: "DELETE_EMPLOYEE", payload: id });
  }

  function getEmployeeById(id) {
    return state.employees.find((e) => e.id === Number(id) || e.id === id);
  }

  return (
    <EmployeeContext.Provider
      value={{
        employees: state.employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeById,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}
