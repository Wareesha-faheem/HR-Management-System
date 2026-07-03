"use client";

import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { DepartmentProvider } from "@/contexts/DepartmentContext";
import EmployeeProvider from "@/contexts/Employee/EmployeeProvider";

export default function Providers({ children }) {
  return (
    
  <AttendanceProvider>
    <DepartmentProvider>
        <EmployeeProvider>
            {children}
        </EmployeeProvider>
    </DepartmentProvider>
  </AttendanceProvider>
  );
}