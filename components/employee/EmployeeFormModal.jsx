"use client";

import { useContext, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import DepartmentContext from "@/contexts/DepartmentContext";
import { ROLES } from "@/utils/rbac";

const EMPTY_FORM = {
  firstName: "", lastName: "", email: "", phone: "",
  departmentId: "", designation: "", salary: "", role: ROLES.EMPLOYEE, status: "Active",
};

export default function EmployeeFormModal({ open, onClose, onSubmit, employeeToEdit, canAssignRole = false }) {
  const { departments } = useContext(DepartmentContext);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(employeeToEdit);

  useEffect(() => {
    if (employeeToEdit) {
      setForm({
        firstName: employeeToEdit.firstName || "",
        lastName: employeeToEdit.lastName || "",
        email: employeeToEdit.email || "",
        phone: employeeToEdit.phone || "",
        departmentId: employeeToEdit.departmentId || "",
        designation: employeeToEdit.designation || "",
        salary: employeeToEdit.salary || "",
        role: employeeToEdit.role || ROLES.EMPLOYEE,
        status: employeeToEdit.status || "Active",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [employeeToEdit, open]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.departmentId) next.departmentId = "Required";
    if (!form.designation.trim()) next.designation = "Required";
    if (!form.salary || Number(form.salary) <= 0) next.salary = "Enter a valid salary";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({ ...form, departmentId: Number(form.departmentId), salary: Number(form.salary) });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit employee" : "Add employee"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Save changes" : "Add employee"}</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="First name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
        <Input label="Last name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required className="sm:col-span-2" />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Select
          label="Department" name="departmentId" value={form.departmentId} onChange={handleChange}
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          error={errors.departmentId} required
        />
        <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} error={errors.designation} required />
        <Input label="Monthly salary (PKR)" name="salary" type="number" value={form.salary} onChange={handleChange} error={errors.salary} required />
        {canAssignRole ? (
          <Select
            label="System role" name="role" value={form.role} onChange={handleChange}
            options={Object.values(ROLES)}
          />
        ) : (
          <Input label="System role" value={form.role} disabled hint="Only a Super Admin can change system roles." />
        )}
        <Select
          label="Status" name="status" value={form.status} onChange={handleChange}
          options={["Active", "On Leave", "Inactive"]}
        />
      </div>
    </Modal>
  );
}
