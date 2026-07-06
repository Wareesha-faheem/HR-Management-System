"use client";

import { useContext } from "react";
import AttendanceContext from "@/contexts/AttendanceContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import { getCurrentDate } from "@/utils/attendanceUtils";
import { Card, CardBody } from "@/components/ui/Card";

export default function AttendanceSummary({ departmentId = null }) {
  const { attendance } = useContext(AttendanceContext);
  const { employees } = useContext(EmployeeContext);
  const today = getCurrentDate();

  const scopedEmployees = departmentId ? employees.filter((e) => e.departmentId === departmentId) : employees;
  const scopedIds = new Set(scopedEmployees.map((e) => e.id));

  const todayAttendance = attendance.filter((r) => r.date === today && scopedIds.has(r.employeeId));
  const present = todayAttendance.filter((r) => r.status === "Present").length;
  const late = todayAttendance.filter((r) => r.status === "Late").length;
  const checkedIn = todayAttendance.filter((r) => r.status === "Checked In").length;
  const halfDay = todayAttendance.filter((r) => r.status === "Half Day").length;
  const absent = scopedEmployees.length - todayAttendance.length;

  const stats = [
    { label: departmentId ? "Team Size" : "Total Employees", value: scopedEmployees.length, color: "text-primary" },
    { label: "Checked In", value: checkedIn, color: "text-sky-500" },
    { label: "Present", value: present, color: "text-emerald-500" },
    { label: "Late", value: late, color: "text-amber-500" },
    { label: "Half Day", value: halfDay, color: "text-orange-500" },
    { label: "Absent", value: Math.max(0, absent), color: "text-red-500" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardBody className="text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-1 text-xs text-secondary">{stat.label}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
