"use client";

import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import PageHeader from "@/components/ui/PageHeader";
import CheckInWidget from "./CheckInWidget";
import AttendanceSummary from "./AttendanceSummary";
import AttendanceRecordsTable from "./AttendanceRecordsTable";
import MyAttendanceHistory from "./MyAttendanceHistory";
import { MODULES, ACTIONS } from "@/utils/rbac";

export default function AttendancePage() {
  const { user } = useContext(AuthContext);
  const { can, isDeptScoped } = usePermissions();
  const canViewAll = can(MODULES.ATTENDANCE, ACTIONS.VIEW_ALL);
  const deptScoped = isDeptScoped(MODULES.ATTENDANCE);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Geofenced check-in/out and attendance history" />

      <CheckInWidget />

      {canViewAll && <AttendanceSummary departmentId={deptScoped ? user.departmentId : null} />}

      <MyAttendanceHistory />

      {canViewAll && <AttendanceRecordsTable departmentId={deptScoped ? user.departmentId : null} />}
    </div>
  );
}
