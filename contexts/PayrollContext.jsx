"use client";

import { createContext } from "react";
import { PayrollReducer } from "@/reducers/PayrollReducer";
import { initialPayroll } from "@/data/payroll";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";

const PayrollContext = createContext(null);
export default PayrollContext;

const initialState = { payroll: initialPayroll };

export function PayrollProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(PayrollReducer, initialState, STORAGE_KEYS.PAYROLL);

  function addPayrollRecord(record) {
    const nextId = Math.max(0, ...state.payroll.map((p) => p.id)) + 1;
    dispatch({ type: "ADD_PAYROLL_RECORD", payload: { id: nextId, paymentStatus: "Pending", ...record } });
  }

  function updatePayrollRecord(id, payload) {
    dispatch({ type: "UPDATE_PAYROLL_RECORD", payload: { id, ...payload } });
  }

  function markPaid(id) {
    dispatch({ type: "MARK_PAID", payload: id });
  }

  function deletePayrollRecord(id) {
    dispatch({ type: "DELETE_PAYROLL_RECORD", payload: id });
  }

  return (
    <PayrollContext.Provider
      value={{ payroll: state.payroll, addPayrollRecord, updatePayrollRecord, markPaid, deletePayrollRecord }}
    >
      {children}
    </PayrollContext.Provider>
  );
}
