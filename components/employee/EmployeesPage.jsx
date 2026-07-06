"use client";

import { useContext, useState } from "react";
import { UserPlus, Pencil, Trash2, Download } from "lucide-react";
import EmployeeContext from "@/contexts/EmployeeContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import NotificationContext from "@/contexts/NotificationContext";
import { usePermissions } from "@/hooks/usePermissions";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import DataTable from "@/components/ui/DataTable";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmployeeFormModal from "./EmployeeFormModal";

import { MODULES, ACTIONS } from "@/utils/rbac";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { exportToCSV } from "@/utils/exportCSV";

export default function EmployeesPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useContext(EmployeeContext);
  const { departments, getDepartmentById } = useContext(DepartmentContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { pushNotification } = useContext(NotificationContext);
  const { can, isDeptScoped } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const canCreate = can(MODULES.EMPLOYEES, ACTIONS.CREATE);
  const canEdit = can(MODULES.EMPLOYEES, ACTIONS.EDIT);
  const canDelete = can(MODULES.EMPLOYEES, ACTIONS.DELETE);
  const canExport = can(MODULES.EMPLOYEES, ACTIONS.EXPORT);
  const canAssignRole = can(MODULES.EMPLOYEES, ACTIONS.ASSIGN_ROLE);

  // A Manager only sees their own department's roster ("their team"), never
  // the full company directory — Super Admin / HR see everyone.
  const scoped = isDeptScoped(MODULES.EMPLOYEES)
    ? employees.filter((e) => e.departmentId === user.departmentId)
    : employees;

  function handleAdd() {
    setEditing(null);
    setModalOpen(true);
  }

  function handleEdit(emp) {
    setEditing(emp);
    setModalOpen(true);
  }

  function handleSubmit(payload) {
    if (editing) {
      updateEmployee(editing.id, payload);
      toast({ title: "Employee updated", description: `${payload.firstName} ${payload.lastName} was updated.`, variant: "success" });
    } else {
      addEmployee(payload);
      toast({ title: "Employee added", description: `${payload.firstName} ${payload.lastName} has joined Kuickpay.`, variant: "success" });
      pushNotification({ title: "New employee added", message: `${payload.firstName} ${payload.lastName} was added to ${getDepartmentById(payload.departmentId)?.name}.`, type: "employee", link: "/employees" });
    }
    setModalOpen(false);
  }

  function handleDelete() {
    const emp = employees.find((e) => e.id === confirmId);
    deleteEmployee(confirmId);
    toast({ title: "Employee removed", description: emp ? `${emp.firstName} ${emp.lastName} was removed.` : "", variant: "default" });
    setConfirmId(null);
  }

  function handleExport() {
    exportToCSV(
      "employees",
      ["First Name", "Last Name", "Email", "Phone", "Department", "Designation", "Salary", "Role", "Status", "Join Date"],
      scoped.map((e) => [
        e.firstName, e.lastName, e.email, e.phone,
        getDepartmentById(e.departmentId)?.name || "", e.designation, e.salary, e.role, e.status, e.joinDate,
      ])
    );
  }

  const columns = [
    {
      key: "name", header: "Employee", sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar firstName={row.firstName} lastName={row.lastName} color={row.avatarColor} size={34} />
          <div>
            <p className="font-medium text-primary">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-secondary">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "designation", header: "Designation", sortable: true },
    { key: "departmentId", header: "Department", render: (row) => getDepartmentById(row.departmentId)?.name || "—" },
    { key: "role", header: "System Role", render: (row) => <span className="text-xs text-secondary">{row.role}</span> },
    { key: "salary", header: "Salary", sortable: true, render: (row) => formatCurrency(row.salary) },
    { key: "joinDate", header: "Joined", sortable: true, render: (row) => formatDate(row.joinDate) },
    { key: "status", header: "Status", render: (row) => <Badge tone={row.status}>{row.status}</Badge> },
  ];

  if (canEdit || canDelete) {
    columns.push({
      key: "actions", header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          {canEdit && (
            <button onClick={() => handleEdit(row)} className="rounded-lg p-1.5 text-secondary hover:bg-surface-2 hover:text-brand">
              <Pencil className="h-4 w-4" />
            </button>
          )}
          {canDelete && (
            <button onClick={() => setConfirmId(row.id)} className="rounded-lg p-1.5 text-secondary hover:bg-red-500/10 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    });
  }

  return (
    <div>
      <PageHeader
        title={isDeptScoped(MODULES.EMPLOYEES) ? "My Team" : "Employees"}
        description={
          isDeptScoped(MODULES.EMPLOYEES)
            ? `${scoped.length} people in your department`
            : `${scoped.length} people across ${departments.length} departments`
        }
        actions={
          <>
            {canExport && (
              <Button variant="secondary" icon={Download} onClick={handleExport}>Export CSV</Button>
            )}
            {canCreate && (
              <Button icon={UserPlus} onClick={handleAdd}>Add employee</Button>
            )}
          </>
        }
      />

      <DataTable
        columns={columns}
        data={scoped}
        searchKeys={["firstName", "lastName", "email", "designation"]}
        searchPlaceholder="Search employees..."
        emptyTitle="No employees yet"
        emptyDescription="Add your first Kuickpay teammate to get started."
      />

      <EmployeeFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        employeeToEdit={editing}
        canAssignRole={canAssignRole}
      />

      <ConfirmDialog
        open={Boolean(confirmId)}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        title="Remove employee"
        description="This will permanently remove the employee record from the prototype."
      />
    </div>
  );
}
