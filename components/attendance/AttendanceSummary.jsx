"use client";

import { useContext } from "react";
import AttendanceContext from "@/contexts/AttendanceContext";
import EmployeeContext from "@/contexts/Employee/EmployeeContext";
import { getCurrentDate } from "@/utils/attendanceUtils";

export default function AttendanceSummary() {
  const { attendance } = useContext(AttendanceContext);
  const { employees } = useContext(EmployeeContext);

  const today = getCurrentDate();

  const todayAttendance = attendance.filter(
    (record) => record.date === today
  );

  const present = todayAttendance.filter(
    (record) => record.status === "Present"
  ).length;

  const late = todayAttendance.filter(
    (record) => record.status === "Late"
  ).length;

  const checkedIn = todayAttendance.filter(
    (record) => record.status === "Checked In"
  ).length;

  const halfDay = todayAttendance.filter(
    (record) => record.status === "Half Day"
  ).length;

  const absent = employees.length - todayAttendance.length;

  const cardStyle = {
    border: "1px solid gray",
    padding: "20px",
    width: "180px",
    textAlign: "center",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
        marginBottom: "30px",
      }}
    >
      <div style={cardStyle}>
        <h3>Total Employees</h3>
        <h1>{employees.length}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Checked In</h3>
        <h1>{checkedIn}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Present</h3>
        <h1>{present}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Late</h3>
        <h1>{late}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Half Day</h3>
        <h1>{halfDay}</h1>
      </div>

      <div style={cardStyle}>
        <h3>Absent</h3>
        <h1>{absent}</h1>
      </div>
    </div>
  );
}