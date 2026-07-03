"use client";

import AttendanceDashboard from "@/components/attendance/AttendanceDashboard";
import MyAttendance from "@/components/attendance/MyAttendance";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import ExportCSVButton from "@/components/attendance/ExportCSVButton";

export default function AttendancePage() {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
      }}
    >
      <h1>Attendance Management</h1>

      <ExportCSVButton />

      <AttendanceSummary />

      <AttendanceDashboard />

      <MyAttendance />

      <AttendanceTable />
    </div>
  );
}