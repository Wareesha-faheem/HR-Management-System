import { createCrudReducer } from "./createCrudReducer";

export const LeaveReducer = createCrudReducer("leaves", "LEAVE", {
  REVIEW_LEAVE: (state, action) => ({
    ...state,
    leaves: state.leaves.map((leave) =>
      leave.id === action.payload.id
        ? { ...leave, status: action.payload.status, reviewedBy: action.payload.reviewedBy }
        : leave
    ),
  }),
});
