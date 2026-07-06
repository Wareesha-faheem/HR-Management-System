"use client";

import { createContext, useCallback, useState } from "react";
import { generateId } from "@/utils/formatters";

const ToastContext = createContext(null);
export default ToastContext;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, variant = "default", duration = 4000 }) => {
      const id = generateId("toast");
      setToasts((prev) => [...prev, { id, title, description, variant }]);
      if (duration) {
        setTimeout(() => dismiss(id), duration);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}
