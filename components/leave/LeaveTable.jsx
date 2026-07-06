"use client";

import { useContext } from "react";
import { Check, X, Trash2 } from "lucide-react";
import LeaveContext from "@/contexts/LeaveContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import NotificationContext from "@/contexts/NotificationContext";

import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { usePermissions } from "@/hooks/usePermissions";
import { MODULES, ACTIONS } from "@/utils/rbac";
import { formatDate } from "@/utils/formatters";
import { leaveDuration } from "@/data/leaves";

export default function LeaveTable({ scope = "all" }) {
  const { leaves, reviewLeave, deleteLeave } = useContext(LeaveContext);
  const { employees, getEmployeeById } = useContext(EmployeeContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { pushNotification } = useContext(NotificationContext);
  const { can, isDeptScoped } = usePermissions();

  const canApprove = can(MODULES.LEAVE, ACTIONS.APPROVE);
  const canDelete = can(MODULES.LEAVE, ACTIONS.DELETE);
  const deptScoped = isDeptScoped(MODULES.LEAVE);

  let rows = leaves;
  if (scope === "mine") {
    rows = leaves.filter((l) => l.employeeId === user.employeeId);
  } else if (deptScoped) {
    // Manager: only requests from people in their own department ("their team")
    const teamIds = new Set(employees.filter((e) => e.departmentId === user.departmentId).map((e) => e.id));
    rows = leaves.filter((l) => teamIds.has(l.employeeId));
  }
  const sorted = [...rows].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function handleReview(leave, status) {
    reviewLeave(leave.id, status, user.employeeId);
    const emp = getEmployeeById(leave.employeeId);
    toast({ title: `Leave ${status.toLowerCase()}`, description: `${emp?.firstName}'s request was ${status.toLowerCase()}.`, variant: status === "Approved" ? "success" : "default" });
    pushNotification({ title: `Leave ${status}`, message: `${emp?.firstName} ${emp?.lastName}'s ${leave.leaveType} leave was ${status.toLowerCase()}.`, type: "leave", link: "/leave" });
  }

  function handleDelete(id) {
    deleteLeave(id);
    toast({ title: "Leave request removed" });
  }

  const columns = [
    ...(scope === "all" ? [{
      key: "employee", header: "Employee",
      render: (row) => {
        const e = getEmployeeById(row.employeeId);
        return (
          <div className="flex items-center gap-2.5">
            <Avatar firstName={e?.firstName} lastName={e?.lastName} color={e?.avatarColor} size={30} />
            <span className="font-medium">{e ? `${e.firstName} ${e.lastName}` : "Unknown"}</span>
          </div>
        );
      },
    }] : []),
    { key: "leaveType", header: "Type" },
    { key: "period", header: "Period", render: (r) => `${formatDate(r.startDate)} - ${formatDate(r.endDate)}` },
    { key: "duration", header: "Days", render: (r) => leaveDuration(r) },
    { key: "reason", header: "Reason", render: (r) => <span className="text-secondary line-clamp-1 max-w-[200px] inline-block">{r.reason}</span> },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
    {
      key: "actions", header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          {canApprove && row.status === "Pending" && (
            <>
              <button onClick={() => handleReview(row, "Approved")} className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-500/10">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => handleReview(row, "Rejected")} className="rounded-lg p-1.5 text-red-500 hover:bg-red-500/10">
                <X className="h-4 w-4" />
              </button>
            </>
          )}
          {(canDelete || (scope === "mine" && row.status === "Pending")) && (
            <button onClick={() => handleDelete(row.id)} className="rounded-lg p-1.5 text-secondary hover:bg-red-500/10 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={sorted}
      searchable={false}
      pageSize={8}
      emptyTitle="No leave requests"
      emptyDescription={scope === "mine" ? "Your leave requests will appear here." : "Team leave requests will appear here."}
    />
  );
}
