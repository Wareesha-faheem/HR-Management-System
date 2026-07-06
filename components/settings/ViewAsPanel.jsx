"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import AuthContext from "@/contexts/AuthContext";
import EmployeeContext from "@/contexts/EmployeeContext";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { ROLES } from "@/utils/rbac";

export default function ViewAsPanel() {
  const { realUser, startImpersonation } = useContext(AuthContext);
  const { employees } = useContext(EmployeeContext);
  const router = useRouter();

  const previewable = employees.filter((e) => e.id !== realUser.employeeId);
  const [selectedId, setSelectedId] = useState(previewable[0]?.id ? String(previewable[0].id) : "");

  function handlePreview() {
    if (!selectedId) return;
    startImpersonation(Number(selectedId));
    router.push("/dashboard");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>View as</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4">
        <p className="text-sm text-secondary">
          Preview the entire app exactly as any employee or manager sees it — their dashboard,
          their nav, their scoped data. You can exit back to your own session at any time.
        </p>
        <div className="flex items-center gap-3">
          <Select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            options={previewable.map((e) => ({ value: e.id, label: `${e.firstName} ${e.lastName} — ${e.role}` }))}
            className="max-w-sm"
          />
          <Button icon={Eye} onClick={handlePreview}>Preview dashboard</Button>
        </div>
      </CardBody>
    </Card>
  );
}
