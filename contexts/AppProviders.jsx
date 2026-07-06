"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { DepartmentProvider } from "@/contexts/DepartmentContext";
import { EmployeeProvider } from "@/contexts/EmployeeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { AttendanceProvider } from "@/contexts/AttendanceContext";
import { LeaveProvider } from "@/contexts/LeaveContext";
import { PayrollProvider } from "@/contexts/PayrollContext";
import { RecruitmentProvider } from "@/contexts/RecruitmentContext";
import { NoticeProvider } from "@/contexts/NoticeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ToastViewport from "@/components/ui/ToastViewport";

// Single composition root for every context provider in the app.
// Department/Employee must be mounted BEFORE Auth, since AuthContext reads
// live employee records to build the session (see contexts/AuthContext.jsx).
export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DepartmentProvider>
          <EmployeeProvider>
            <AuthProvider>
              <PermissionsProvider>
                <AttendanceProvider>
                  <LeaveProvider>
                    <PayrollProvider>
                      <RecruitmentProvider>
                        <NoticeProvider>
                          <NotificationProvider>
                            {children}
                            <ToastViewport />
                          </NotificationProvider>
                        </NoticeProvider>
                      </RecruitmentProvider>
                    </PayrollProvider>
                  </LeaveProvider>
                </AttendanceProvider>
              </PermissionsProvider>
            </AuthProvider>
          </EmployeeProvider>
        </DepartmentProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
