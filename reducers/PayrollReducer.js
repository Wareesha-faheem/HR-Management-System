import { createCrudReducer } from "./createCrudReducer";

export const PayrollReducer = createCrudReducer("payroll", "PAYROLL_RECORD", {
  MARK_PAID: (state, action) => ({
    ...state,
    payroll: state.payroll.map((record) =>
      record.id === action.payload
        ? { ...record, paymentStatus: "Paid", paymentDate: new Date().toISOString().split("T")[0] }
        : record
    ),
  }),
});
