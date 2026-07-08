"use client";

import { Users, Building2, CalendarClock, Wallet } from "lucide-react";
import { getCurrentDate } from "@/utils/attendanceUtils";

export default function DashboardCards({ employees, departments, attendance, leaves, payroll }) {
  const today = getCurrentDate();
  const todayAttendance = attendance.filter((a) => a.date === today);
  const present = todayAttendance.filter((a) => ["Present", "Late", "Checked In"].includes(a.status)).length;
  const presencePct = employees.length ? Math.round((present / employees.length) * 100) : 0;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
  const pendingPayroll = payroll.filter((p) => p.paymentStatus === "Pending").length;

  const tiles = [
    {
      label: "Total employees",
      value: employees.length,
      sub: `${presencePct}% present today`,
      icon: Users,
    },
    { label: "Departments", value: departments.length, icon: Building2 },
    { label: "Pending leaves", value: pendingLeaves, icon: CalendarClock },
    { label: "Payroll pending", value: pendingPayroll, icon: Wallet },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-lg border border-[rgb(var(--border-subtle))] bg-surface p-4"
        >
          <div className="flex items-center justify-between">
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-[rgb(var(--border-subtle))] text-brand">
              <tile.icon className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-3 text-xl font-semibold text-primary">{tile.value}</p>
          <p className="text-xs text-secondary">{tile.sub || tile.label}</p>
        </div>
      ))}
    </div>
  );
}