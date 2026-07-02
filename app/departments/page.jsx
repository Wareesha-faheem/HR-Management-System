"use client";

import { useContext, useState } from "react";
import { DepartmentContext } from "@/contexts/DepartmentContext";

const emptyForm = {
  name: "",
  code: "",
  managerId: null,
  location: "",
  description: "",
  status: "Active",
};

export default function DepartmentsPage() {
  const {
    departments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useContext(DepartmentContext);

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.code ||
      !formData.location ||
      !formData.description
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingId) {
      updateDepartment({
        ...formData,
        id: editingId,
      });

      setEditingId(null);
    } else {
      addDepartment({
        id: Date.now(),
        ...formData,
      });
    }

    setFormData(emptyForm);
  }

  function handleEdit(department) {
    setEditingId(department.id);
    setFormData(department);
  }

  function handleDelete(id) {
    if (confirm("Delete this department?")) {
      deleteDepartment(id);

      if (editingId === id) {
        setEditingId(null);
        setFormData(emptyForm);
      }
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(emptyForm);
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "30px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Department Management</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid gray",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>Department Name</label>
          <br />
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Department Code</label>
          <br />
          <input
            name="code"
            value={formData.code}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Location</label>
          <br />
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description</label>
          <br />
          <textarea
            rows={3}
            cols={40}
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <button type="submit">
          {editingId ? "Update Department" : "Add Department"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Departments</h2>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        width="100%"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Location</th>
            <th>Description</th>
            <th>Status</th>
            <th>Manager</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.length === 0 ? (
            <tr>
              <td colSpan="7" align="center">
                No Departments
              </td>
            </tr>
          ) : (
            departments.map((department) => (
              <tr key={department.id}>
                <td>{department.name}</td>

                <td>{department.code}</td>

                <td>{department.location}</td>

                <td>{department.description}</td>

                <td>{department.status}</td>

                <td>
                  {department.managerId ?? "Not Assigned"}
                </td>

                <td>
                  <button
                    onClick={() => handleEdit(department)}
                  >
                    Edit
                  </button>

                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDelete(department.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}