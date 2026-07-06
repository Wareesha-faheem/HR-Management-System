"use client";

import { useContext } from "react";
import AttendanceContext from "@/contexts/AttendanceContext";
import AuthContext from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import Badge from "@/components/ui/Badge";

export default function MyAttendanceHistory() {
  const { attendance } = useContext(AttendanceContext);
  const { user } = useContext(AuthContext);

  const mine = attendance.filter((r) => r.employeeId === user.employeeId).sort((a, b) => new Date(b.date) - new Date(a.date));

  const columns = [
    { key: "date", header: "Date", sortable: true },
    { key: "checkIn", header: "Check In" },
    { key: "checkOut", header: "Check Out", render: (r) => r.checkOut || "--" },
    { key: "totalHours", header: "Hours" },
    { key: "overtime", header: "Overtime" },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
  ];

  return (
    <Card>
      <CardHeader><CardTitle>My attendance history</CardTitle></CardHeader>
      <CardBody>
        <DataTable columns={columns} data={mine} searchable={false} pageSize={8} emptyTitle="No attendance recorded yet" />
      </CardBody>
    </Card>
  );
}
