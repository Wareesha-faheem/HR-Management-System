"use client";

import { useContext, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import DepartmentContext from "@/contexts/DepartmentContext";
import AuthContext from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { MODULES } from "@/utils/rbac";
import { PROJECT_STATUSES } from "@/data/projects";

const EMPTY = { name: "", description: "", departmentId: "", status: "Active" };

export default function ProjectFormModal({ open, onClose, onSubmit, project }) {
  const { departments } = useContext(DepartmentContext);
  const { user } = useContext(AuthContext);
  const { isDeptScoped } = usePermissions();
  const deptLocked = isDeptScoped(MODULES.PROJECTS);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setForm({ name: project.name, description: project.description, departmentId: project.departmentId, status: project.status });
    } else {
      setForm({ ...EMPTY, departmentId: deptLocked ? user.departmentId : "" });
    }
    setErrors({});
  }, [project, open, deptLocked, user?.departmentId]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Required";
    if (!form.departmentId) next.departmentId = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({ ...form, departmentId: Number(form.departmentId) });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={project ? "Edit project" : "New project"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{project ? "Save changes" : "Create project"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Project name" name="name" value={form.name} onChange={handleChange} error={errors.name} required />
        <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Department" name="departmentId" value={form.departmentId} onChange={handleChange}
            options={departments.map((d) => ({ value: d.id, label: d.name }))}
            error={errors.departmentId} required disabled={deptLocked}
          />
          {project && (
            <Select
              label="Status" name="status" value={form.status} onChange={handleChange}
              options={PROJECT_STATUSES.map((s) => ({ value: s, label: s }))}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
