"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { getCurrentDate } from "@/utils/attendanceUtils";

export default function MySnapshot({ user, attendance, leaves, getLeaveBalance }) {
  const today = getCurrentDate();
  const todayRecord = attendance.find((a) => a.employeeId === user.employeeId && a.date === today);
  const myLeaves = leaves.filter((l) => l.employeeId === user.employeeId);
  const balance = getLeaveBalance(user.employeeId);
  const annual = balance.find((b) => b.type === "Annual");

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Today's status</CardTitle></CardHeader>
        <CardBody>
          {todayRecord ? (
            <>
              <Badge tone={todayRecord.status}>{todayRecord.status}</Badge>
              <p className="mt-2 text-sm text-secondary">Checked in at {todayRecord.checkIn}</p>
            </>
          ) : (
            <>
              <p className="text-sm text-secondary">You haven't checked in yet.</p>
              <Link href="/attendance" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">
                Go to Attendance →
              </Link>
            </>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Annual leave balance</CardTitle></CardHeader>
        <CardBody>
          <p className="text-2xl font-bold text-primary">{annual?.remaining ?? 0}<span className="text-sm font-normal text-secondary"> / {annual?.total ?? 0} days</span></p>
          <Link href="/leave" className="mt-2 inline-block text-sm font-medium text-brand hover:underline">Request leave →</Link>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>My leave requests</CardTitle></CardHeader>
        <CardBody>
          <p className="text-2xl font-bold text-primary">{myLeaves.filter((l) => l.status === "Pending").length}</p>
          <p className="text-sm text-secondary">pending approval</p>
        </CardBody>
      </Card>
    </div>
  );
}
