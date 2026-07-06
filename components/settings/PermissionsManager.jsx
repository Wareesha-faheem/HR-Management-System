"use client";

import { useContext, useState } from "react";
import { ShieldPlus, RotateCcw } from "lucide-react";
import EmployeeContext from "@/contexts/EmployeeContext";
import PermissionsContext from "@/contexts/PermissionsContext";
import ToastContext from "@/contexts/ToastContext";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { MODULES, ACTIONS, ROLES } from "@/utils/rbac";

const GRANTABLE = [
  { module: MODULES.RECRUITMENT, action: ACTIONS.FINALIZE, label: "Finalize hires (Offer / Hire / Reject)" },
  { module: MODULES.RECRUITMENT, action: ACTIONS.CREATE, label: "Create job postings & candidates" },
  { module: MODULES.EMPLOYEES, action: ACTIONS.VIEW_ALL, label: "View entire employee directory" },
  { module: MODULES.ATTENDANCE, action: ACTIONS.VIEW_ALL, label: "View company-wide attendance" },
  { module: MODULES.LEAVE, action: ACTIONS.VIEW_ALL, label: "View company-wide leave requests" },
  { module: MODULES.PAYROLL, action: ACTIONS.EDIT, label: "Process payroll runs" },
  { module: MODULES.PAYROLL, action: ACTIONS.VIEW_ALL, label: "View company-wide payroll" },
  { module: MODULES.REPORTS, action: ACTIONS.EXPORT, label: "Export reports" },
];

function ThreeWayToggle({ value, onChange }) {
  const options = [
    { key: false, label: "Revoke" },
    { key: undefined, label: "Default" },
    { key: true, label: "Grant" },
  ];
  return (
    <div className="inline-flex rounded-lg border border-[rgb(var(--border-subtle))] p-0.5 bg-surface-2">
      {options.map((opt) => (
        <button
          key={opt.label}
          onClick={() => onChange(opt.key)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            value === opt.key ? "bg-brand-gradient text-white" : "text-secondary hover:text-primary"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function PermissionsManager() {
  const { employees } = useContext(EmployeeContext);
  const { getOverridesFor, setOverride, clearOverridesFor } = useContext(PermissionsContext);
  const { toast } = useContext(ToastContext);

  const grantable = employees.filter((e) => e.role !== ROLES.SUPER_ADMIN);
  const [selectedId, setSelectedId] = useState(grantable[0]?.id ? String(grantable[0].id) : "");

  const selectedEmployee = employees.find((e) => e.id === Number(selectedId));
  const overrides = selectedEmployee ? getOverridesFor(selectedEmployee.id) : {};

  function handleToggle(module, action, value) {
    if (!selectedEmployee) return;
    setOverride(selectedEmployee.id, module, action, value === undefined ? null : value);
    toast({ title: "Permission updated", description: `${selectedEmployee.firstName}'s access was updated.`, variant: "success" });
  }

  function handleReset() {
    if (!selectedEmployee) return;
    clearOverridesFor(selectedEmployee.id);
    toast({ title: "Custom permissions cleared" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom permissions</CardTitle>
      </CardHeader>
      <CardBody className="space-y-5">
        <p className="text-sm text-secondary">
          Grant or revoke a specific capability for one person, beyond what their role normally allows —
          e.g. let a particular Manager finalize hires, or a specific HR staffer process payroll.
        </p>

        <div className="flex items-center gap-3">
          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            options={grantable.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName} — ${e.role}` }))}
            className="max-w-sm"
          />
          {selectedEmployee && Object.keys(overrides).length > 0 && (
            <Button variant="ghost" size="sm" icon={RotateCcw} onClick={handleReset}>Reset to role defaults</Button>
          )}
        </div>

        {selectedEmployee && (
          <div className="rounded-xl border border-[rgb(var(--border-subtle))] divide-y divide-[rgb(var(--border-subtle))]">
            {GRANTABLE.map((item) => (
              <div key={`${item.module}-${item.action}`} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-sm text-primary">{item.label}</span>
                <ThreeWayToggle
                  value={overrides?.[item.module]?.[item.action]}
                  onChange={(val) => handleToggle(item.module, item.action, val)}
                />
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
