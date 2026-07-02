"use client";

import { useState } from "react";
import EmployeeProvider from "@/contexts/Employee/EmployeeProvider";
import EmployeeTable from "@/components/employee/EmployeeTable";
import AddEmployee from "@/components/employee/AddEmployee";

function EmployeesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  function handleAddClick() {
    setEditingEmployee(null);
    setShowForm(true);
  }

  function handleEditClick(emp) {
    setEditingEmployee(emp);
    setShowForm(true);
  }

  function handleClose() {
    setShowForm(false);
    setEditingEmployee(null);
  }

  return (
    <EmployeeProvider>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employees</h1>

          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Employee
          </button>
        </div>

        {showForm && (
          <AddEmployee onClose={handleClose} employeeToEdit={editingEmployee} />
        )}

        <EmployeeTable onEdit={handleEditClick} />
      </div>
    </EmployeeProvider>
  );
}

export default EmployeesPage;