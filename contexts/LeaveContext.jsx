"use client";

import { createContext } from "react";
import { LeaveReducer } from "@/reducers/LeaveReducer";
import { initialLeaves, DEFAULT_LEAVE_BALANCE } from "@/data/leaves";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";
import { leaveDuration } from "@/data/leaves";

const LeaveContext = createContext(null);
export default LeaveContext;

const initialState = { leaves: initialLeaves };

export function LeaveProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(LeaveReducer, initialState, STORAGE_KEYS.LEAVES);

  function applyLeave(leave) {
    const nextId = Math.max(0, ...state.leaves.map((l) => l.id)) + 1;
    dispatch({
      type: "ADD_LEAVE",
      payload: {
        id: nextId,
        status: "Pending",
        appliedOn: new Date().toISOString().split("T")[0],
        createdAt: new Date().toISOString(),
        ...leave,
      },
    });
  }

  function reviewLeave(id, status, reviewedBy) {
    dispatch({ type: "REVIEW_LEAVE", payload: { id, status, reviewedBy } });
  }

  function deleteLeave(id) {
    dispatch({ type: "DELETE_LEAVE", payload: id });
  }

  function getLeaveBalance(employeeId) {
    const used = { ...DEFAULT_LEAVE_BALANCE };
    Object.keys(used).forEach((type) => (used[type] = 0));

    state.leaves
      .filter((l) => l.employeeId === employeeId && l.status === "Approved")
      .forEach((l) => {
        used[l.leaveType] = (used[l.leaveType] || 0) + leaveDuration(l);
      });

    return Object.keys(DEFAULT_LEAVE_BALANCE).map((type) => ({
      type,
      total: DEFAULT_LEAVE_BALANCE[type],
      used: used[type] || 0,
      remaining: Math.max(0, DEFAULT_LEAVE_BALANCE[type] - (used[type] || 0)),
    }));
  }

  return (
    <LeaveContext.Provider
      value={{ leaves: state.leaves, applyLeave, reviewLeave, deleteLeave, getLeaveBalance }}
    >
      {children}
    </LeaveContext.Provider>
  );
}
