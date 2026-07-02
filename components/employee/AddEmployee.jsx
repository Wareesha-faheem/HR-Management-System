"use client";

import React, { useContext, useState, useEffect } from "react";
import EmployeeContext from "@/contexts/Employee/EmployeeContext";

function AddEmployee({ onClose, employeeToEdit }) {
  const { addEmployee, updateEmployee } = useContext(EmployeeContext);
  const isEditing = Boolean(employeeToEdit);

  const [form, setForm] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    depid: "",
    des: "",
    sal: "",
    role: "",
  });

  // Prefill form when editing
  useEffect(() => {
    if (employeeToEdit) {
      setForm({
        fname: employeeToEdit.firstName || "",
        lname: employeeToEdit.lastName || "",
        email: employeeToEdit.email || "",
        phone: employeeToEdit.phone || "",
        depid: employeeToEdit.departmentId || "",
        des: employeeToEdit.designation || "",
        sal: employeeToEdit.salary || "",
        role: employeeToEdit.role || "",
      });
    }
  }, [employeeToEdit]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit() {
    const payload = {
      firstName: form.fname,
      lastName: form.lname,
      email: form.email,
      phone: form.phone,
      departmentId: form.depid,
      designation: form.des,
      salary: form.sal,
      role: form.role,
    };

    if (isEditing) {
      updateEmployee(employeeToEdit.id, payload);
    } else {
      addEmployee({ ...payload, status: "Active" });
    }

    onClose?.();
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? "Edit Employee" : "Add Employee"}
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <input className="border p-2 rounded" placeholder="First Name" name="fname" value={form.fname} onChange={handleChange} />
        <input className="border p-2 rounded" placeholder="Last Name" name="lname" value={form.lname} onChange={handleChange} />

        <input className="border p-2 rounded col-span-2" placeholder="Email" name="email" value={form.email} onChange={handleChange} />

        <input className="border p-2 rounded" placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <input className="border p-2 rounded" placeholder="Department ID" name="depid" value={form.depid} onChange={handleChange} />

        <input className="border p-2 rounded" placeholder="Designation" name="des" value={form.des} onChange={handleChange} />
        <input className="border p-2 rounded" placeholder="Salary" name="sal" value={form.sal} onChange={handleChange} />

        <select className="border p-2 rounded col-span-2" name="role" value={form.role} onChange={handleChange}>
          <option value="">Select Role</option>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
          <option value="Admin">Admin</option>
          <option value="Super Admin">Super Admin</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 mt-5">
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit}>
          {isEditing ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

export default AddEmployee;