"use client";

import { useContext, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import DepartmentContext from "@/contexts/DepartmentContext";

const EMPTY = { name: "", email: "", phone: "", position: "", departmentId: "", resumeNote: "" };

export default function CandidateFormModal({ open, onClose, onSubmit }) {
  const { departments } = useContext(DepartmentContext);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.position.trim()) next.position = "Required";
    if (!form.departmentId) next.departmentId = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({ ...form, departmentId: Number(form.departmentId) });
    setForm(EMPTY);
  }

  return (
    <Modal
      open={open} onClose={onClose} title="Add candidate"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Add candidate</Button></>}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} required className="sm:col-span-2" />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Input label="Position applied for" name="position" value={form.position} onChange={handleChange} error={errors.position} required />
        <Select
          label="Department" name="departmentId" value={form.departmentId} onChange={handleChange}
          options={departments.map((d) => ({ value: d.id, label: d.name }))} error={errors.departmentId} required
        />
        <Textarea label="Notes" name="resumeNote" value={form.resumeNote} onChange={handleChange} className="sm:col-span-2" />
      </div>
    </Modal>
  );
}
