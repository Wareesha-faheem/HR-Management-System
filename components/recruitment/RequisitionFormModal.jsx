"use client";

import { useContext, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import AuthContext from "@/contexts/AuthContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import { usePermissions } from "@/hooks/usePermissions";
import { MODULES } from "@/utils/rbac";

export default function RequisitionFormModal({ open, onClose, onSubmit }) {
  const { user } = useContext(AuthContext);
  const { departments } = useContext(DepartmentContext);
  const { isDeptScoped } = usePermissions();
  const managerLocked = isDeptScoped(MODULES.RECRUITMENT);

  const [form, setForm] = useState({ positionTitle: "", departmentId: managerLocked ? user.departmentId : "", justification: "" });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.positionTitle.trim()) next.positionTitle = "Required";
    if (!form.departmentId) next.departmentId = "Required";
    if (!form.justification.trim()) next.justification = "Tell HR why this role is needed";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({ ...form, departmentId: Number(form.departmentId), requestedBy: user.employeeId });
    setForm({ positionTitle: "", departmentId: managerLocked ? user.departmentId : "", justification: "" });
  }

  return (
    <Modal
      open={open} onClose={onClose} title="Raise a hiring requisition"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Submit requisition</Button></>}
    >
      <div className="space-y-4">
        <Input label="Position title" name="positionTitle" value={form.positionTitle} onChange={handleChange} error={errors.positionTitle} required placeholder="e.g. Senior Backend Engineer" />
        <Select
          label="Department" name="departmentId" value={form.departmentId} onChange={handleChange}
          options={departments.map((d) => ({ value: d.id, label: d.name }))}
          error={errors.departmentId} required disabled={managerLocked}
        />
        <Textarea label="Why is this role needed?" name="justification" value={form.justification} onChange={handleChange} error={errors.justification} required />
      </div>
    </Modal>
  );
}
