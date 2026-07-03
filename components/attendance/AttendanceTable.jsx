"use client";

import { useContext, useState } from "react";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceContext from "@/contexts/AttendanceContext";
import EmployeeContext from "@/contexts/Employee/EmployeeContext";

export default function AttendanceTable() {
  const { attendance, deleteAttendance } =
    useContext(AttendanceContext);

  const { employees } = useContext(EmployeeContext);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const filteredAttendance = attendance.filter((record) => {
  const employee = employees.find(
    (emp) => emp.id == record.employeeId
  );

  const employeeName = employee
    ? `${employee.firstName} ${employee.lastName}`.toLowerCase()
    : "";

  const matchesSearch = employeeName.includes(
    search.toLowerCase()
  );

  const matchesStatus =
    statusFilter === "" ||
    record.status === statusFilter;

  const matchesDate =
    dateFilter === "" ||
    record.date === dateFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesDate
  );
});

  function handleDelete(id) {
    if (confirm("Delete this attendance record?")) {
      deleteAttendance(id);
    }
  }

  return (
    <div
      style={{
        marginTop: "40px",
        border: "1px solid gray",
        padding: "20px",
      }}
    >
      <h2>Attendance Records (HR)</h2>
      <AttendanceFilters
  search={search}
  setSearch={setSearch}
  statusFilter={statusFilter}
  setStatusFilter={setStatusFilter}
  dateFilter={dateFilter}
  setDateFilter={setDateFilter}
/>

      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        width="100%"
      >
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Hours</th>
            <th>Overtime</th>
            <th>Status</th>
            <th>Office</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredAttendance.length === 0 ? (
            <tr>
              <td colSpan="9" align="center">
                No attendance records.
              </td>
            </tr>
          ) : (
            filteredAttendance.map((record) => {
              const employee = employees.find(
                (emp) => emp.id == record.employeeId
              );

              return (
                <tr key={record.id}>
                  <td>
                    {employee
                      ? `${employee.firstName} ${employee.lastName}`
                      : "Unknown Employee"}
                  </td>

                  <td>{record.date}</td>

                  <td>{record.checkIn}</td>

                  <td>{record.checkOut || "--"}</td>

                  <td>{record.totalHours}</td>

                  <td>{record.overtime}</td>

                  <td>{record.status}</td>

                  <td>
                    {record.insideOffice
                      ? "✅ Verified"
                      : "❌ Outside"}
                  </td>

                  <td>
                    <button>Edit</button>

                    <button
                      style={{ marginLeft: "8px" }}
                      onClick={() =>
                        handleDelete(record.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}