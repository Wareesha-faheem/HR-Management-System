"use client";

import { useContext, useEffect, useState } from "react";
import AttendanceContext from "@/contexts/AttendanceContext";
import {
  getCurrentDate,
  getCurrentTime,
  isInsideOffice,
} from "@/utils/attendanceUtils";

export default function AttendanceDashboard() {
  const { attendance, checkIn, checkOut } =
    useContext(AttendanceContext);

  // Temporary logged in employee
  // Later this will come from AuthContext
  const employeeId = 1;
  const [currentTime, setCurrentTime] = useState(getCurrentTime());

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentTime(getCurrentTime());
  }, 1000);

  return () => clearInterval(interval);
}, []);

  const today = getCurrentDate();

  const todayAttendance = attendance.find(
    (record) =>
      record.employeeId === employeeId &&
      record.date === today
  );

  function handleCheckIn() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const officeStatus = isInsideOffice(
          latitude,
          longitude
        );

        if (!officeStatus.insideOffice) {
          alert(
            `You are outside the office.\nDistance: ${officeStatus.distance} meters`
          );
          return;
        }

        checkIn(
          employeeId,
          latitude,
          longitude,
          officeStatus.insideOffice
        );
      },
      () => {
        alert("Unable to get your location.");
      }
    );
  }

  function handleCheckOut() {
    checkOut(employeeId);
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        marginBottom: "30px",
      }}
    >
      <h2>Today's Attendance</h2>

      <p>
        <strong>Date:</strong> {today}
      </p>

      <p>
        <strong>Current Time:</strong> {currentTime}
      </p>

      {!todayAttendance ? (
        <>
          <p>Status : Not Checked In</p>

          <button onClick={handleCheckIn}>
            Check In
          </button>
        </>
      ) : (
        <>
          <p>
            <strong>Status:</strong>{" "}
            {todayAttendance.status}
          </p>

          <p>
            <strong>Check In:</strong>{" "}
            {todayAttendance.checkIn}
          </p>

          <p>
            <strong>Check Out:</strong>{" "}
            {todayAttendance.checkOut || "--"}
          </p>

          <p>
            <strong>Total Hours:</strong>{" "}
            {todayAttendance.totalHours}
          </p>

          <p>
            <strong>Overtime:</strong>{" "}
            {todayAttendance.overtime}
          </p>

          <p>
            <strong>Office Verification:</strong>{" "}
            {todayAttendance.insideOffice
              ? "Inside Office ✅"
              : "Outside Office ❌"}
          </p>

          {!todayAttendance.checkOut && (
            <button onClick={handleCheckOut}>
              Check Out
            </button>
          )}
        </>
      )}
    </div>
  );
}