"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { LEAVE_TYPES } from "@/data/leaves";

const EMPTY = { leaveType: "", startDate: "", endDate: "", reason: "" };

export default function LeaveRequestModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.leaveType) next.leaveType = "Select a leave type";
    if (!form.startDate) next.startDate = "Required";
    if (!form.endDate) next.endDate = "Required";
    if (form.startDate && form.endDate && form.endDate < form.startDate) next.endDate = "Must be after start date";
    if (!form.reason.trim()) next.reason = "Tell us briefly why";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(form);
    setForm(EMPTY);
  }

  return (
    <Modal
      open={open} onClose={onClose} title="Request leave"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit request</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Select label="Leave type" name="leaveType" value={form.leaveType} onChange={handleChange} options={LEAVE_TYPES} error={errors.leaveType} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start date" name="startDate" type="date" value={form.startDate} onChange={handleChange} error={errors.startDate} required />
          <Input label="End date" name="endDate" type="date" value={form.endDate} onChange={handleChange} error={errors.endDate} required />
        </div>
        <Textarea label="Reason" name="reason" value={form.reason} onChange={handleChange} error={errors.reason} required placeholder="Briefly describe the reason for leave" />
      </div>
    </Modal>
  );
}
