"use client";

import { createContext, useReducer } from "react";
import { AttendanceReducer } from "@/reducers/AttendanceReducer";
import { initialAttendance } from "@/data/attendance";
import {
  getCurrentDate,
  getCurrentTime,
  calculateHours,
  calculateOvertime,
  calculateStatus,
} from "@/utils/attendanceUtils";

const AttendanceContext = createContext();

const initialState = {
  attendance: initialAttendance,
};

export function AttendanceProvider({ children }) {
  const [state, dispatch] = useReducer(
    AttendanceReducer,
    initialState
  );

  function addAttendance(record) {
    dispatch({
      type: "ADD_ATTENDANCE",
      payload: record,
    });
  }

  function updateAttendance(record) {
    dispatch({
      type: "UPDATE_ATTENDANCE",
      payload: record,
    });
  }

  function deleteAttendance(id) {
    dispatch({
      type: "DELETE_ATTENDANCE",
      payload: id,
    });
  }

  function checkIn(employeeId, latitude, longitude, insideOffice) {
    const today = getCurrentDate();

    const alreadyCheckedIn = state.attendance.find(
      (record) =>
        record.employeeId === employeeId &&
        record.date === today
    );

    if (alreadyCheckedIn) {
      alert("You have already checked in today.");
      return;
    }

    addAttendance({
      id: Date.now(),
      employeeId,
      date: today,
      checkIn: getCurrentTime(),
      checkOut: "",
      totalHours: 0,
      overtime: 0,
      status: "Checked In",
      latitude,
      longitude,
      insideOffice,
      remarks: "",
      editedByHR: false,
    });
  }

  function checkOut(employeeId) {
    const today = getCurrentDate();

    const record = state.attendance.find(
      (attendance) =>
        attendance.employeeId === employeeId &&
        attendance.date === today
    );

    if (!record) {
      alert("Check in first.");
      return;
    }

    if (record.checkOut) {
      alert("Already checked out.");
      return;
    }

    const checkOutTime = getCurrentTime();

    const totalHours = calculateHours(
      record.checkIn,
      checkOutTime
    );

    const overtime = calculateOvertime(totalHours);

    const status = calculateStatus(
      record.checkIn,
      totalHours
    );

    updateAttendance({
      ...record,
      checkOut: checkOutTime,
      totalHours,
      overtime,
      status,
    });
  }

  return (
    <AttendanceContext.Provider
      value={{
        attendance: state.attendance,
        addAttendance,
        updateAttendance,
        deleteAttendance,
        checkIn,
        checkOut,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export default AttendanceContext;