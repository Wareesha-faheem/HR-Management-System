"use client";

import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import AttendanceContext from "@/contexts/AttendanceContext";
import LeaveContext from "@/contexts/LeaveContext";
import PayrollContext from "@/contexts/PayrollContext";

import PageHeader from "@/components/ui/PageHeader";
import DashboardCards from "./DashboardCards";
import QuickActions from "./QuickActions";
import RecentLeaves from "./RecentLeaves";
import RecentEmployees from "./RecentEmployees";
import AttendanceTrendChart from "./AttendanceTrendChart";
import MySnapshot from "./MySnapshot";
import NoticeBoard from "./NoticeBoard";
import { isManagerOrAbove, ROLES } from "@/utils/rbac";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { employees } = useContext(EmployeeContext);
  const { departments } = useContext(DepartmentContext);
  const { attendance } = useContext(AttendanceContext);
  const { leaves, getLeaveBalance } = useContext(LeaveContext);
  const { payroll } = useContext(PayrollContext);

  const elevated = isManagerOrAbove(user.role) || user.role === ROLES.PAYROLL_MANAGER;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user.firstName}`}
        description={`Here's what's happening across Kuickpay today · ${user.role}`}
      />

      {elevated && (
        <DashboardCards employees={employees} departments={departments} attendance={attendance} leaves={leaves} payroll={payroll} />
      )}

      {!elevated && (
        <MySnapshot user={user} attendance={attendance} leaves={leaves} getLeaveBalance={getLeaveBalance} />
      )}

      <QuickActions />

      <NoticeBoard />

      {elevated && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AttendanceTrendChart attendance={attendance} />
          </div>
          <RecentLeaves leaves={leaves} employees={employees} />
        </div>
      )}

      {elevated && (
        <RecentEmployees employees={employees} departments={departments} />
      )}
    </div>
  );
}
