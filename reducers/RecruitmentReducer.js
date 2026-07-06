import { createCrudReducer } from "./createCrudReducer";

export const RecruitmentReducer = createCrudReducer("candidates", "CANDIDATE", {
  MOVE_CANDIDATE_STAGE: (state, action) => ({
    ...state,
    candidates: state.candidates.map((c) =>
      c.id === action.payload.id ? { ...c, stage: action.payload.stage } : c
    ),
  }),
  ADD_REQUISITION: (state, action) => ({
    ...state,
    requisitions: [action.payload, ...(state.requisitions || [])],
  }),
  UPDATE_REQUISITION: (state, action) => ({
    ...state,
    requisitions: (state.requisitions || []).map((r) =>
      r.id === action.payload.id ? { ...r, ...action.payload } : r
    ),
  }),
  DELETE_REQUISITION: (state, action) => ({
    ...state,
    requisitions: (state.requisitions || []).filter((r) => r.id !== action.payload),
  }),
});
