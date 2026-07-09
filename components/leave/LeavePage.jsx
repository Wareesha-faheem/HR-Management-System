"use client";

import { useContext, useState } from "react";
import { CalendarPlus } from "lucide-react";
import LeaveContext from "@/contexts/LeaveContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import NotificationContext from "@/contexts/NotificationContext";

import { usePermissions } from "@/hooks/usePermissions";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import LeaveBalanceCards from "./LeaveBalanceCards";
import LeaveRequestModal from "./LeaveRequestModal";
import LeaveTable from "./LeaveTable";
import { MODULES, ACTIONS } from "@/utils/rbac";

export default function LeavePage() {
  const { applyLeave, getLeaveBalance } = useContext(LeaveContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { pushNotification } = useContext(NotificationContext);
  const { can, isDeptScoped } = usePermissions();
  const [modalOpen, setModalOpen] = useState(false);

  const canViewAll = can(MODULES.LEAVE, ACTIONS.VIEW_ALL);
  const deptScoped = isDeptScoped(MODULES.LEAVE);
  const balance = getLeaveBalance(user.employeeId);

  function handleSubmit(form) {
    applyLeave({ ...form, employeeId: user.employeeId });
    toast({ title: "Leave request submitted", description: "Your manager will review it shortly.", variant: "success" });
    pushNotification({ title: "New leave request", message: `${user.firstName} ${user.lastName} requested ${form.leaveType} leave.`, type: "leave", link: "/leave", audience: "roles", roles: ["HR", "Manager"] });
    setModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave"
        description="Track balances, request time off, and review your team's requests"
        actions={<Button icon={CalendarPlus} onClick={() => setModalOpen(true)}>Request leave</Button>}
      />

      <LeaveBalanceCards balance={balance} />

      <Card>
        <CardHeader><CardTitle>My leave requests</CardTitle></CardHeader>
        <CardBody><LeaveTable scope="mine" /></CardBody>
      </Card>

      {canViewAll && (
        <Card>
          <CardHeader><CardTitle>{deptScoped ? "My team's leave requests" : "Team leave requests"}</CardTitle></CardHeader>
          <CardBody><LeaveTable scope="all" /></CardBody>
        </Card>
      )}

      <LeaveRequestModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}
