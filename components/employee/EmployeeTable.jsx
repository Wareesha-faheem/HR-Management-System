"use client";

import { useContext } from "react";
import EmployeeContext from "@/contexts/Employee/EmployeeContext";

function EmployeeTable({ onEdit }) {
  const { employees, deleteEmployee } = useContext(EmployeeContext);

  return (
    <div className="bg-white shadow rounded-xl p-4 mt-6">
      <h2 className="text-lg font-semibold mb-4">Employee List</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">ID</th>
            <th className="p-2">Role</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-b">
              <td className="p-2">
                {emp.firstName} {emp.lastName}
              </td>
              <td className="p-2">{emp.id}</td>
              <td className="p-2">{emp.role}</td>
              <td className="p-2">
                <button
                  onClick={() => onEdit(emp)}
                  className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEmployee(emp.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTable;