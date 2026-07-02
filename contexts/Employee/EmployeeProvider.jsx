"use client";
import { useState } from "react";
import EmployeeContext from "./EmployeeContext";

export default function EmployeeProvider({ children }) {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      firstName: "Wareesha",
      lastName: "Faheem",
      email: "wareesha@gmail.com",
      phone: "0321-2809141",
      departmentId: 2,
      designation: "Frontend Developer",
      salary: 80000,
      status: "Active",
      role: "Employee"
    },
    {
      id: 2,
      firstName: "Rumaisa",
      lastName: "Farhan",
      email: "rumaisa@gmail.com",
      phone: "0321-2809141",
      departmentId: 2,
      designation: "Frontend Developer",
      salary: 80000,
      status: "Active",
      role: "Manager"
    }
  ]);

  // ➕ Add employee
  const addEmployee = (employee) => {
    setEmployees((prev) => [
      ...prev,
      { id: Date.now(), ...employee }
    ]);
  };

  // ❌ Delete employee
  const deleteEmployee = (id) => {
    setEmployees((prev) =>
      prev.filter((emp) => emp.id !== id)
    );
  };

  // ✏️ Update employee
  const updateEmployee = (id, updatedFields) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === id ? { ...emp, ...updatedFields } : emp
      )
    );
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        deleteEmployee,
        updateEmployee
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
}