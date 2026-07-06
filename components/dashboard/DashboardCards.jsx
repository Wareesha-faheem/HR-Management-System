"use client";

import { Users, Building2, UserCheck, CalendarClock, Wallet, TrendingUp } from "lucide-react";
import { getCurrentDate } from "@/utils/attendanceUtils";

export default function DashboardCards({ employees, departments, attendance, leaves, payroll }) {
  const today = getCurrentDate();
  const todayAttendance = attendance.filter((a) => a.date === today);
  const present = todayAttendance.filter((a) => ["Present", "Late", "Checked In"].includes(a.status)).length;
  const presencePct = employees.length ? Math.round((present / employees.length) * 100) : 0;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
  const pendingPayroll = payroll.filter((p) => p.paymentStatus === "Pending").length;

  const tiles = [
    { label: "Departments", value: departments.length, icon: Building2 },
    { label: "Pending Leaves", value: pendingLeaves, icon: CalendarClock },
    { label: "Payroll Pending", value: pendingPayroll, icon: Wallet },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {/* Hero tile — spans two columns, carries the brand gradient identity
          instead of one card in a row of identical white boxes. */}
      <div className="relative col-span-2 row-span-2 overflow-hidden rounded-xl2 bg-brand-gradient p-6 text-white shadow-glow-brand">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 -left-6 h-36 w-36 rounded-full bg-navy-950/20 blur-2xl" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
              <Users className="h-5 w-5" />
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium backdrop-blur">
              <TrendingUp className="h-3 w-3" /> {presencePct}% present today
            </span>
          </div>
          <div>
            <p className="text-4xl font-bold font-display tracking-tight">{employees.length}</p>
            <p className="mt-1 text-sm text-white/75">Total employees across Kuickpay</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <UserCheck className="h-3.5 w-3.5" />
            {present} of {employees.length} checked in today
          </div>
        </div>
      </div>

      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-xl2 border border-[rgb(var(--border-subtle))] bg-surface p-4 flex flex-col justify-between">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient-soft text-brand">
            <tile.icon className="h-4 w-4" />
          </span>
          <div className="mt-3">
            <p className="text-xl font-bold font-display text-primary">{tile.value}</p>
            <p className="text-xs text-secondary">{tile.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
