"use client";

import { Users, UserCheck, UserX, Clock, CalendarClock, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/utils/cn";

function Trend({ delta, goodDirection = "up" }) {
  if (delta === null || delta === undefined || Number.isNaN(delta) || delta === 0) return null;
  const isUp = delta > 0;
  const isGood = goodDirection === "up" ? isUp : !isUp;
  const Icon = isUp ? TrendingUp : TrendingDown;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", isGood ? "text-emerald-500" : "text-red-500")}>
      <Icon className="h-3 w-3" /> {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

export default function ReportSummaryCards({ metrics }) {
  const {
    totalEmployees, attendanceRate, attendanceRateDelta,
    absentToday, lateCount, lateDelta,
    pendingLeaves, thisMonthPayroll, payrollDelta,
  } = metrics;

  const cards = [
    { label: "Total Employees", value: totalEmployees, icon: Users, tint: "text-brand" },
    { label: "Attendance Rate", value: `${attendanceRate}%`, icon: UserCheck, tint: "text-emerald-500", trend: <Trend delta={attendanceRateDelta} goodDirection="up" /> },
    { label: "Absent Today", value: absentToday, icon: UserX, tint: "text-red-500" },
    { label: "Late Arrivals", value: lateCount, icon: Clock, tint: "text-amber-500", trend: <Trend delta={lateDelta} goodDirection="down" /> },
    { label: "Pending Leaves", value: pendingLeaves, icon: CalendarClock, tint: "text-fuchsia-500" },
    { label: "Payroll (this month)", value: formatCurrency(thisMonthPayroll), icon: Wallet, tint: "text-brand-light", trend: <Trend delta={payrollDelta} goodDirection="up" /> },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.label} className="animate-fade-in">
          <CardBody>
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient-soft", card.tint)}>
              <card.icon className="h-4 w-4" />
            </span>
            <p className="mt-3 text-xl font-bold font-display text-primary truncate">{card.value}</p>
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <p className="text-xs text-secondary">{card.label}</p>
              {card.trend}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
