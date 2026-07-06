"use client";

import { createContext } from "react";
import { RecruitmentReducer } from "@/reducers/RecruitmentReducer";
import { initialCandidates } from "@/data/candidates";
import { initialRequisitions } from "@/data/requisitions";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";

const RecruitmentContext = createContext(null);
export default RecruitmentContext;

const initialState = { candidates: initialCandidates, requisitions: initialRequisitions };

export function RecruitmentProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(RecruitmentReducer, initialState, STORAGE_KEYS.CANDIDATES);

  function addCandidate(candidate) {
    const nextId = Math.max(0, ...state.candidates.map((c) => c.id)) + 1;
    dispatch({
      type: "ADD_CANDIDATE",
      payload: { id: nextId, stage: "Applied", appliedOn: new Date().toISOString().split("T")[0], rating: 0, ...candidate },
    });
  }

  function updateCandidate(id, payload) {
    dispatch({ type: "UPDATE_CANDIDATE", payload: { id, ...payload } });
  }

  function moveStage(id, stage) {
    dispatch({ type: "MOVE_CANDIDATE_STAGE", payload: { id, stage } });
  }

  function deleteCandidate(id) {
    dispatch({ type: "DELETE_CANDIDATE", payload: id });
  }

  function addRequisition(requisition) {
    const nextId = Math.max(0, ...state.requisitions.map((r) => r.id)) + 1;
    dispatch({
      type: "ADD_REQUISITION",
      payload: { id: nextId, status: "Open", createdAt: new Date().toISOString(), ...requisition },
    });
  }

  function updateRequisitionStatus(id, status) {
    dispatch({ type: "UPDATE_REQUISITION", payload: { id, status } });
  }

  function deleteRequisition(id) {
    dispatch({ type: "DELETE_REQUISITION", payload: id });
  }

  return (
    <RecruitmentContext.Provider
      value={{
        candidates: state.candidates,
        addCandidate,
        updateCandidate,
        moveStage,
        deleteCandidate,
        requisitions: state.requisitions || [],
        addRequisition,
        updateRequisitionStatus,
        deleteRequisition,
      }}
    >
      {children}
    </RecruitmentContext.Provider>
  );
}
