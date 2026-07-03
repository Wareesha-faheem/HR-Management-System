"use client";

import { useContext } from "react";
import AttendanceContext from "@/contexts/AttendanceContext";
import EmployeeContext from "@/contexts/Employee/EmployeeContext";

export default function ExportCSVButton() {
  const { attendance } = useContext(AttendanceContext);
  const { employees } = useContext(EmployeeContext);

  function exportCSV() {
    const headers = [
      "Employee",
      "Date",
      "Check In",
      "Check Out",
      "Hours",
      "Overtime",
      "Status",
    ];

    const rows = attendance.map((record) => {
      const employee = employees.find(
        (emp) => emp.id == record.employeeId
      );

      return [
        employee
          ? `${employee.firstName} ${employee.lastName}`
          : "Unknown Employee",
        record.date,
        record.checkIn,
        record.checkOut,
        record.totalHours,
        record.overtime,
        record.status,
      ];
    });

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "attendance-report.csv";

    link.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={exportCSV}
      style={{
        marginBottom: "20px",
      }}
    >
      Export CSV
    </button>
  );
}