"use client";

import { createContext } from "react";
import { AttendanceReducer } from "@/reducers/AttendanceReducer";
import { initialAttendance } from "@/data/attendance";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";
import {
  getCurrentDate,
  getCurrentTime,
  computeStatusFromCheckIn,
  computeTotalHours,
  computeOvertime,
  finalizeStatus,
} from "@/utils/attendanceUtils";

const AttendanceContext = createContext(null);
export default AttendanceContext;

const initialState = { attendance: initialAttendance };

export function AttendanceProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(AttendanceReducer, initialState, STORAGE_KEYS.ATTENDANCE);

  function checkIn(employeeId, latitude, longitude, insideOffice) {
    const time = getCurrentTime().slice(0, 5);
    const nextId = Math.max(0, ...state.attendance.map((a) => a.id)) + 1;

    dispatch({
      type: "CHECK_IN",
      payload: {
        id: nextId,
        employeeId,
        date: getCurrentDate(),
        checkIn: time,
        checkOut: null,
        totalHours: 0,
        overtime: 0,
        status: computeStatusFromCheckIn(time),
        insideOffice,
        latitude,
        longitude,
      },
    });
  }

  function checkOut(employeeId) {
    const today = getCurrentDate();
    const record = state.attendance.find((r) => r.employeeId === employeeId && r.date === today);
    if (!record) return;

    const time = getCurrentTime().slice(0, 5);
    const totalHours = computeTotalHours(record.checkIn, time);
    const overtime = computeOvertime(totalHours);
    const status = finalizeStatus(totalHours, record.status);

    dispatch({
      type: "CHECK_OUT",
      payload: { id: record.id, checkOut: time, totalHours, overtime, status },
    });
  }

  function addManualAttendance(record) {
    const nextId = Math.max(0, ...state.attendance.map((a) => a.id)) + 1;
    dispatch({ type: "ADD_ATTENDANCE", payload: { id: nextId, ...record } });
  }

  function updateAttendance(id, payload) {
    dispatch({ type: "UPDATE_ATTENDANCE", payload: { id, ...payload } });
  }

  function deleteAttendance(id) {
    dispatch({ type: "DELETE_ATTENDANCE", payload: id });
  }

  return (
    <AttendanceContext.Provider
      value={{
        attendance: state.attendance,
        checkIn,
        checkOut,
        addManualAttendance,
        updateAttendance,
        deleteAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}
