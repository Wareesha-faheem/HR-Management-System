"use client";

import { useContext } from "react";
import AttendanceContext from "@/contexts/AttendanceContext";

export default function MyAttendance() {
  const { attendance } = useContext(AttendanceContext);

  // Temporary logged-in employee
  const employeeId = 1;

  const myAttendance = attendance.filter(
    (record) => record.employeeId === employeeId
  );

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        marginTop: "30px",
      }}
    >
      <h2>My Attendance History</h2>

      {myAttendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          width="100%"
        >
          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hours</th>
              <th>Overtime</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {myAttendance.map((record) => (
              <tr key={record.id}>
                <td>{record.date}</td>

                <td>{record.checkIn}</td>

                <td>{record.checkOut || "--"}</td>

                <td>{record.totalHours}</td>

                <td>{record.overtime}</td>

                <td>{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}