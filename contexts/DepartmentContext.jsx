"use client";

import { createContext, useReducer } from "react";
import { DepartmentReducer } from "@/reducers/DepartmentReducer";
import { initialDepartments } from "@/data/departments";

export const DepartmentContext = createContext();

const initialState = {
  departments: initialDepartments,
};

export function DepartmentProvider({ children }) {
  const [state, dispatch] = useReducer(
    DepartmentReducer,
    initialState
  );

  function addDepartment(department) {
    dispatch({
      type: "ADD_DEPARTMENT",
      payload: department,
    });
  }

  function updateDepartment(department) {
    dispatch({
      type: "UPDATE_DEPARTMENT",
      payload: department,
    });
  }

  function deleteDepartment(id) {
    dispatch({
      type: "DELETE_DEPARTMENT",
      payload: id,
    });
  }

  return (
    <DepartmentContext.Provider
      value={{
        departments: state.departments,
        addDepartment,
        updateDepartment,
        deleteDepartment,
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
}