"use client";

import { DepartmentProvider } from "@/contexts/DepartmentContext";

export default function Providers({ children }) {
  return (
    <DepartmentProvider>
      {children}
    </DepartmentProvider>
  );
}