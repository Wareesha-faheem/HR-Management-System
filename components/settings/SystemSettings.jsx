"use client";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { ROLES } from "@/utils/rbac";

export default function SystemSettings() {
  return (
    <Card>
      <CardHeader><CardTitle>System (Super Admin)</CardTitle></CardHeader>
      <CardBody className="space-y-4">
        <div>
          <p className="text-sm font-medium text-primary mb-2">Roles configured</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(ROLES).map((role) => (
              <span key={role} className="rounded-full border border-[rgb(var(--border-subtle))] bg-surface-2 px-3 py-1 text-xs text-secondary">{role}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-primary mb-1">Data storage</p>
          <p className="text-sm text-secondary">All records for this prototype are persisted to your browser's LocalStorage. No data leaves your device.</p>
        </div>
        <div>
          <p className="text-sm font-medium text-primary mb-1">Office geofence</p>
          <p className="text-sm text-secondary">Attendance check-in requires being within 300m of Kuickpay HQ (mock coordinates).</p>
        </div>
      </CardBody>
    </Card>
  );
}
