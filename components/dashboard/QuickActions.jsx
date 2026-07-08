"use client";

import { useRouter } from "next/navigation";
import { Users, Building2, Fingerprint, CalendarDays, Wallet, BarChart3 } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { MODULES, ACTIONS } from "@/utils/rbac";

const ACTION_DEFS = [
  { module: MODULES.EMPLOYEES, label: "Employees", href: "/employees", icon: Users },
  { module: MODULES.DEPARTMENTS, label: "Departments", href: "/departments", icon: Building2 },
  { module: MODULES.ATTENDANCE, label: "Attendance", href: "/attendance", icon: Fingerprint },
  { module: MODULES.LEAVE, label: "Leave", href: "/leave", icon: CalendarDays },
  { module: MODULES.PAYROLL, label: "Payroll", href: "/payroll", icon: Wallet },
  { module: MODULES.REPORTS, label: "Reports", href: "/reports", icon: BarChart3 },
];

export default function QuickActions() {
  const router = useRouter();
  const { can } = usePermissions();

  const actions = ACTION_DEFS.filter((a) => can(a.module, ACTIONS.VIEW));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
      </CardHeader>
      <CardBody className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.href}
            onClick={() => router.push(action.href)}
            className="flex flex-col items-center gap-2 rounded-md border border-[rgb(var(--border-subtle))] bg-surface p-3.5 text-center hover:border-brand/50 hover:bg-surface-2 transition-colors"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--border-subtle))] text-brand">
              <action.icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium text-primary">{action.label}</span>
          </button>
        ))}
      </CardBody>
    </Card>
  );
}