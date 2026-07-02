"use client";

import { DepartmentProvider } from "@/contexts/DepartmentContext";
import EmployeeProvider from "@/contexts/Employee/EmployeeProvider";

export default function Providers({ children }) {
  return (
    <DepartmentProvider>
        <EmployeeProvider>
            {children}
        </EmployeeProvider>
    </DepartmentProvider>
  );
}