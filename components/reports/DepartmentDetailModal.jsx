"use client";

import { useContext } from "react";
import { Users, TrendingUp, CalendarClock, Wallet } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import ProgressBar from "@/components/ui/ProgressBar";
import EmployeeContext from "@/contexts/EmployeeContext";
import LeaveContext from "@/contexts/LeaveContext";
import PayrollContext from "@/contexts/PayrollContext";
import { formatCurrency } from "@/utils/formatters";

export default function DepartmentDetailModal({ open, onClose, department, attendanceRate }) {
  const { employees, getEmployeeById } = useContext(EmployeeContext);
  const { leaves } = useContext(LeaveContext);
  const { payroll } = useContext(PayrollContext);

  if (!department) return null;

  const deptEmployees = employees.filter((e) => e.departmentId === department.id);
  const deptEmployeeIds = new Set(deptEmployees.map((e) => e.id));
  const deptLeaves = leaves.filter((l) => deptEmployeeIds.has(l.employeeId) && l.status === "Pending");
  const manager = getEmployeeById(department.managerId);
  const currentMonth = payroll[0]?.month;
  const deptPayrollCost = payroll
    .filter((p) => deptEmployeeIds.has(p.employeeId) && p.month === currentMonth)
    .reduce((sum, p) => sum + p.netSalary, 0);

  return (
    <Modal open={open} onClose={onClose} title={department.name} size="lg">
      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-xl border border-[rgb(var(--border-subtle))] p-4">
          <div>
            <p className="text-xs text-secondary">Manager</p>
            <p className="text-sm font-medium text-primary">{manager ? `${manager.firstName} ${manager.lastName}` : "Unassigned"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">Location</p>
            <p className="text-sm font-medium text-primary">{department.location}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">Headcount</p>
            <p className="text-sm font-medium text-primary">{deptEmployees.length} / {department.headcountTarget || "—"}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] p-3.5">
            <Users className="h-4 w-4 text-brand mb-1.5" />
            <p className="text-lg font-bold font-display text-primary">{deptEmployees.length}</p>
            <p className="text-xs text-secondary">Team members</p>
          </div>
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] p-3.5">
            <TrendingUp className="h-4 w-4 text-emerald-500 mb-1.5" />
            <p className="text-lg font-bold font-display text-primary">{attendanceRate}%</p>
            <p className="text-xs text-secondary">Attendance rate</p>
            <ProgressBar value={attendanceRate} thresholds className="mt-2" />
          </div>
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] p-3.5">
            <Wallet className="h-4 w-4 text-brand-light mb-1.5" />
            <p className="text-lg font-bold font-display text-primary">{formatCurrency(deptPayrollCost)}</p>
            <p className="text-xs text-secondary">{currentMonth} payroll</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-primary mb-2 flex items-center gap-1.5">
            <CalendarClock className="h-4 w-4" /> Pending leave requests ({deptLeaves.length})
          </p>
          {deptLeaves.length === 0 ? (
            <p className="text-sm text-secondary">No pending requests from this department.</p>
          ) : (
            <div className="space-y-2">
              {deptLeaves.map((l) => {
                const emp = getEmployeeById(l.employeeId);
                return (
                  <div key={l.id} className="flex items-center justify-between gap-3 rounded-lg border border-[rgb(var(--border-subtle))] px-3 py-2">
                    <div className="flex items-center gap-2.5">
                      <Avatar firstName={emp?.firstName} lastName={emp?.lastName} color={emp?.avatarColor} size={28} />
                      <span className="text-sm text-primary">{emp?.firstName} {emp?.lastName}</span>
                    </div>
                    <Badge tone="Pending">{l.leaveType}</Badge>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
