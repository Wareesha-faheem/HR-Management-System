import { createCrudReducer } from "./createCrudReducer";

export const AttendanceReducer = createCrudReducer("attendance", "ATTENDANCE", {
  CHECK_IN: (state, action) => ({
    ...state,
    attendance: [action.payload, ...state.attendance],
  }),
  CHECK_OUT: (state, action) => ({
    ...state,
    attendance: state.attendance.map((record) =>
      record.id === action.payload.id ? { ...record, ...action.payload } : record
    ),
  }),
});
