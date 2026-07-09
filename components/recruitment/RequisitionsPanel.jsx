"use client";

import { useContext, useState } from "react";
import { ClipboardList, Plus, CheckCircle2, XCircle } from "lucide-react";
import RecruitmentContext from "@/contexts/RecruitmentContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import NotificationContext from "@/contexts/NotificationContext";
import { usePermissions } from "@/hooks/usePermissions";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import RequisitionFormModal from "./RequisitionFormModal";
import { MODULES, ACTIONS } from "@/utils/rbac";
import { formatDate } from "@/utils/formatters";

export default function RequisitionsPanel() {
  const { requisitions, addRequisition, updateRequisitionStatus } = useContext(RecruitmentContext);
  const { getDepartmentById } = useContext(DepartmentContext);
  const { getEmployeeById } = useContext(EmployeeContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { pushNotification } = useContext(NotificationContext);
  const { can, isDeptScoped } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);

  const canRequest = can(MODULES.RECRUITMENT, ACTIONS.REQUISITION);
  const canFinalize = can(MODULES.RECRUITMENT, ACTIONS.FINALIZE);
  const deptScoped = isDeptScoped(MODULES.RECRUITMENT);

  const visible = deptScoped ? requisitions.filter((r) => r.departmentId === user.departmentId) : requisitions;

  function handleSubmit(payload) {
    addRequisition(payload);
    toast({ title: "Requisition submitted", description: "HR will review your hiring request.", variant: "success" });
    pushNotification({
      title: "New hiring requisition",
      message: `${getDepartmentById(payload.departmentId)?.name} requested a ${payload.positionTitle}.`,
      type: "recruitment",
      link: "/recruitment",
      audience: "roles",
      roles: ["HR"],
    });
    setModalOpen(false);
  }

  function handleStatus(id, status) {
    updateRequisitionStatus(id, status);
    toast({ title: `Requisition marked ${status.toLowerCase()}` });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring requisitions</CardTitle>
        {canRequest && <Button size="sm" icon={Plus} onClick={() => setModalOpen(true)}>New requisition</Button>}
      </CardHeader>
      <CardBody>
        {visible.length === 0 ? (
          <EmptyState icon={ClipboardList} title="No open requisitions" description="Managers can raise a hiring request here when their team needs to grow." />
        ) : (
          <div className="space-y-2.5">
            {visible.map((req) => {
              const requester = getEmployeeById(req.requestedBy);
              return (
                <div key={req.id} className="flex items-center justify-between gap-3 rounded-xl border border-[rgb(var(--border-subtle))] p-3.5">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary">{req.positionTitle}</p>
                    <p className="text-xs text-secondary truncate">
                      {getDepartmentById(req.departmentId)?.name} · requested by {requester ? `${requester.firstName} ${requester.lastName}` : "Unknown"} · {formatDate(req.createdAt)}
                    </p>
                    <p className="text-xs text-secondary mt-1 line-clamp-1">{req.justification}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge tone={req.status === "Open" ? "Pending" : req.status === "Fulfilled" ? "Approved" : "Rejected"}>{req.status}</Badge>
                    {canFinalize && req.status === "Open" && (
                      <>
                        <button onClick={() => handleStatus(req.id, "Fulfilled")} className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-500/10" title="Mark fulfilled">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleStatus(req.id, "Closed")} className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10" title="Close without filling">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>

      <RequisitionFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </Card>
  );
}
