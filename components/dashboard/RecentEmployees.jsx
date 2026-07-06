"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { formatDate } from "@/utils/formatters";

export default function RecentEmployees({ employees, departments }) {
  const recent = [...employees].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5);

  function departmentName(id) {
    return departments.find((d) => d.id === Number(id))?.name || "—";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently joined</CardTitle>
        <Link href="/employees" className="text-xs font-medium text-brand hover:underline">View all</Link>
      </CardHeader>
      <CardBody className="space-y-1">
        {recent.map((emp) => (
          <div key={emp.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-[rgb(var(--border-subtle))] last:border-0">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar firstName={emp.firstName} lastName={emp.lastName} color={emp.avatarColor} size={34} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary truncate">{emp.firstName} {emp.lastName}</p>
                <p className="text-xs text-secondary">{departmentName(emp.departmentId)} · {formatDate(emp.joinDate)}</p>
              </div>
            </div>
            <Badge tone={emp.status}>{emp.status}</Badge>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
