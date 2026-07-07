"use client";

import { useContext, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import EmployeeContext from "@/contexts/EmployeeContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/data/tasks";

const EMPTY = { title: "", description: "", assigneeType: "employee", assigneeId: "", priority: "Medium", dueDate: "", status: "Not Started" };

// `restrictDepartmentId`: when a Manager is creating/editing, limit the
// employee/department pickers to their own department (dept-scoped access).
export default function TaskFormModal({ open, onClose, onSubmit, task, restrictDepartmentId }) {
  const { employees } = useContext(EmployeeContext);
  const { departments } = useContext(DepartmentContext);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        assigneeType: task.assigneeType,
        assigneeId: task.assigneeId,
        priority: task.priority,
        dueDate: task.dueDate || "",
        status: task.status,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [task, open]);

  const employeeOptions = (restrictDepartmentId ? employees.filter((e) => e.departmentId === restrictDepartmentId) : employees)
    .map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName}` }));
  const departmentOptions = (restrictDepartmentId ? departments.filter((d) => d.id === restrictDepartmentId) : departments)
    .map((d) => ({ value: d.id, label: d.name }));

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value, ...(name === "assigneeType" ? { assigneeId: "" } : {}) }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Required";
    if (!form.assigneeId) next.assigneeId = "Required";
    if (!form.dueDate) next.dueDate = "Required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit({ ...form, assigneeId: Number(form.assigneeId) });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={task ? "Edit task" : "New task"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{task ? "Save changes" : "Create task"}</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Task title" name="title" value={form.title} onChange={handleChange} error={errors.title} required />
        <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Assign to" name="assigneeType" value={form.assigneeType} onChange={handleChange}
            options={[{ value: "employee", label: "Employee" }, { value: "department", label: "Department" }]}
          />
          {form.assigneeType === "employee" ? (
            <Select
              label="Employee" name="assigneeId" value={form.assigneeId} onChange={handleChange}
              options={employeeOptions} error={errors.assigneeId} required
            />
          ) : (
            <Select
              label="Department" name="assigneeId" value={form.assigneeId} onChange={handleChange}
              options={departmentOptions} error={errors.assigneeId} required
            />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Priority" name="priority" value={form.priority} onChange={handleChange}
            options={TASK_PRIORITIES.map((p) => ({ value: p, label: p }))}
          />
          <Input label="Due date" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} error={errors.dueDate} required />
          {task && (
            <Select
              label="Status" name="status" value={form.status} onChange={handleChange}
              options={TASK_STATUSES.map((s) => ({ value: s, label: s }))}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}
