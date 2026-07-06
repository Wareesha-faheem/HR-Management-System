"use client";

import { createContext } from "react";
import { NoticeReducer } from "@/reducers/NoticeReducer";
import { initialNotices } from "@/data/notices";
import { usePersistedReducer } from "@/hooks/usePersistedReducer";
import { STORAGE_KEYS } from "@/utils/storage";
import { generateId } from "@/utils/formatters";

const NoticeContext = createContext(null);
export default NoticeContext;

const initialState = { notices: initialNotices };

export function NoticeProvider({ children }) {
  const [state, dispatch] = usePersistedReducer(NoticeReducer, initialState, STORAGE_KEYS.NOTICES);

  function postNotice({ title, message, scope, departmentId, postedBy }) {
    dispatch({
      type: "ADD_NOTICE",
      payload: {
        id: generateId("notice"),
        title,
        message,
        scope,
        departmentId: scope === "department" ? departmentId : null,
        postedBy,
        createdAt: new Date().toISOString(),
      },
    });
  }

  function deleteNotice(id) {
    dispatch({ type: "DELETE_NOTICE", payload: id });
  }

  // Notices relevant to a given viewer: every company-wide notice, plus
  // department notices for their own department.
  function getVisibleNotices(departmentId) {
    return [...state.notices]
      .filter((n) => n.scope === "company" || n.departmentId === departmentId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return (
    <NoticeContext.Provider value={{ notices: state.notices, postNotice, deleteNotice, getVisibleNotices }}>
      {children}
    </NoticeContext.Provider>
  );
}
