"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Avatar from "@/components/ui/Avatar";
import { formatDate } from "@/utils/formatters";
import { CalendarClock } from "lucide-react";

export default function RecentLeaves({ leaves, employees }) {
  const recent = [...leaves]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  function employee(id) {
    return employees.find((e) => e.id === id);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent leave requests</CardTitle>
        <Link href="/leave" className="text-xs font-medium text-brand hover:underline">View all</Link>
      </CardHeader>
      <CardBody className="space-y-1">
        {recent.length === 0 ? (
          <EmptyState icon={CalendarClock} title="No leave requests" description="Leave applications will appear here." />
        ) : (
          recent.map((leave) => {
            const emp = employee(leave.employeeId);
            return (
              <div key={leave.id} className="flex items-center justify-between gap-3 py-2.5 border-b border-[rgb(var(--border-subtle))] last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar firstName={emp?.firstName} lastName={emp?.lastName} color={emp?.avatarColor} size={34} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-primary truncate">{emp ? `${emp.firstName} ${emp.lastName}` : "Unknown"}</p>
                    <p className="text-xs text-secondary">{leave.leaveType} · {formatDate(leave.startDate)}</p>
                  </div>
                </div>
                <Badge tone={leave.status}>{leave.status}</Badge>
              </div>
            );
          })
        )}
      </CardBody>
    </Card>
  );
}
