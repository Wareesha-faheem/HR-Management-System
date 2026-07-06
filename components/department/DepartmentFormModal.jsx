"use client";

import { useContext, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import EmployeeContext from "@/contexts/EmployeeContext";

const EMPTY_FORM = { name: "", code: "", managerId: "", description: "", headcountTarget: "", location: "" };

export default function DepartmentFormModal({ open, onClose, onSubmit, departmentToEdit }) {
  const { employees } = useContext(EmployeeContext);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const isEditing = Boolean(departmentToEdit);

  useEffect(() => {
    if (departmentToEdit) {
      setForm({
        name: departmentToEdit.name || "",
        code: departmentToEdit.code || "",
        managerId: departmentToEdit.managerId || "",
        description: departmentToEdit.description || "",
        headcountTarget: departmentToEdit.headcountTarget || "",
        location: departmentToEdit.location || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [departmentToEdit, open]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.code.trim()) next.code = "Required";
    if (!form.managerId) next.managerId = "Assign a manager";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({
      ...form,
      managerId: Number(form.managerId),
      headcountTarget: Number(form.headcountTarget) || 0,
    });
  }

  return (
    <Modal
      open={open} onClose={onClose} title={isEditing ? "Edit department" : "Add department"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{isEditing ? "Save changes" : "Add department"}</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Department name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
        <Input label="Code" name="code" value={form.code} onChange={handleChange} error={errors.code} required placeholder="ENG" />
        <Select
          label="Manager" name="managerId" value={form.managerId} onChange={handleChange} error={errors.managerId} required
          options={employees.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName}` }))}
        />
        <Input label="Location" name="location" value={form.location} onChange={handleChange} />
        <Input label="Headcount target" name="headcountTarget" type="number" value={form.headcountTarget} onChange={handleChange} className="sm:col-span-2" />
        <Textarea label="Description" name="description" value={form.description} onChange={handleChange} className="sm:col-span-2" />
      </div>
    </Modal>
  );
}
