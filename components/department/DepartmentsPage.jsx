"use client";

import { useContext, useState } from "react";
import { Building2, Plus, Pencil, Trash2, Users, MapPin } from "lucide-react";
import DepartmentContext from "@/contexts/DepartmentContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import { usePermissions } from "@/hooks/usePermissions";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import DepartmentFormModal from "./DepartmentFormModal";
import { MODULES, ACTIONS } from "@/utils/rbac";

export default function DepartmentsPage() {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useContext(DepartmentContext);
  const { employees, getEmployeeById } = useContext(EmployeeContext);
  const { toast } = useContext(ToastContext);
  const { can } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const canCreate = can(MODULES.DEPARTMENTS, ACTIONS.CREATE);
  const canEdit = can(MODULES.DEPARTMENTS, ACTIONS.EDIT);
  const canDelete = can(MODULES.DEPARTMENTS, ACTIONS.DELETE);

  function headcountFor(deptId) {
    return employees.filter((e) => e.departmentId === deptId).length;
  }

  function handleSubmit(payload) {
    if (editing) {
      updateDepartment(editing.id, payload);
      toast({ title: "Department updated", variant: "success" });
    } else {
      addDepartment(payload);
      toast({ title: "Department created", variant: "success" });
    }
    setModalOpen(false);
  }

  function handleDelete() {
    deleteDepartment(confirmId);
    toast({ title: "Department removed" });
    setConfirmId(null);
  }

  return (
    <div>
      <PageHeader
        title="Departments"
        description={`${departments.length} departments across Kuickpay`}
        actions={canCreate && (
          <Button icon={Plus} onClick={() => { setEditing(null); setModalOpen(true); }}>Add department</Button>
        )}
      />

      {departments.length === 0 ? (
        <EmptyState icon={Building2} title="No departments yet" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {departments.map((dept) => {
            const manager = getEmployeeById(dept.managerId);
            const headcount = headcountFor(dept.id);
            const pct = dept.headcountTarget ? Math.min(100, Math.round((headcount / dept.headcountTarget) * 100)) : 0;

            return (
              <Card key={dept.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white font-bold shadow-glow-brand">
                        {dept.code}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{dept.name}</p>
                        <p className="text-xs text-secondary flex items-center gap-1"><MapPin className="h-3 w-3" />{dept.location}</p>
                      </div>
                    </div>
                    {(canEdit || canDelete) && (
                      <div className="flex gap-1">
                        {canEdit && (
                          <button onClick={() => { setEditing(dept); setModalOpen(true); }} className="rounded-lg p-1.5 text-secondary hover:bg-surface-2 hover:text-brand">
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button onClick={() => setConfirmId(dept.id)} className="rounded-lg p-1.5 text-secondary hover:bg-red-500/10 hover:text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-sm text-secondary line-clamp-2">{dept.description}</p>

                  <div className="mt-4 flex items-center gap-2 text-sm text-secondary">
                    <Users className="h-4 w-4" />
                    Manager: <span className="text-primary font-medium">{manager ? `${manager.firstName} ${manager.lastName}` : "Unassigned"}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-secondary mb-1">
                      <span>Headcount</span>
                      <span>{headcount} / {dept.headcountTarget || "—"}</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                      <div className="h-full bg-brand-gradient rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      <DepartmentFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} departmentToEdit={editing} />
      <ConfirmDialog
        open={Boolean(confirmId)} onClose={() => setConfirmId(null)} onConfirm={handleDelete}
        title="Remove department" description="Employees in this department will remain, but will no longer be linked to a valid department until reassigned."
      />
    </div>
  );
}
