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
import { MODULES, ACTIONS } from "@/utils/rbac";

export default function NoticeFormModal({ open, onClose, onSubmit }) {
  const { user } = useContext(AuthContext);
  const { departments } = useContext(DepartmentContext);
  const { can } = usePermissions();

  const canPostCompany = can(MODULES.NOTICES, ACTIONS.POST_COMPANY);
  const canPostDept = can(MODULES.NOTICES, ACTIONS.POST_DEPARTMENT);

  const [form, setForm] = useState({
    title: "", message: "",
    scope: canPostCompany ? "company" : "department",
    departmentId: canPostCompany ? "" : user.departmentId,
  });
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Required";
    if (!form.message.trim()) next.message = "Required";
    if (form.scope === "department" && !form.departmentId) next.departmentId = "Pick a department";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({ ...form, postedBy: user.employeeId });
    setForm({ title: "", message: "", scope: canPostCompany ? "company" : "department", departmentId: canPostCompany ? "" : user.departmentId });
  }

  return (
    <Modal
      open={open} onClose={onClose} title="Post a notice"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Post notice</Button></>}
    >
      <div className="space-y-4">
        <Input label="Title" name="title" value={form.title} onChange={handleChange} error={errors.title} required />
        <Textarea label="Message" name="message" value={form.message} onChange={handleChange} error={errors.message} required rows={3} />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Audience" name="scope" value={form.scope} onChange={handleChange}
            options={[
              ...(canPostCompany ? [{ value: "company", label: "Whole company" }] : []),
              ...(canPostDept ? [{ value: "department", label: "My department" }] : []),
            ]}
          />
          {form.scope === "department" && (
            <Select
              label="Department" name="departmentId" value={form.departmentId} onChange={handleChange}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
              error={errors.departmentId}
              disabled={!canPostCompany}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
