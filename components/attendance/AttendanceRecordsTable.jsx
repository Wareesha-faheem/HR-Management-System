"use client";

import { useContext, useState } from "react";
import { Trash2, Download, MapPin } from "lucide-react";
import AttendanceContext from "@/contexts/AttendanceContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import AuthContext from "@/contexts/AuthContext";
import ToastContext from "@/contexts/ToastContext";
import { usePermissions } from "@/hooks/usePermissions";

import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import DataTable from "@/components/ui/DataTable";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import { MODULES, ACTIONS } from "@/utils/rbac";
import { exportToCSV } from "@/utils/exportCSV";

export default function AttendanceRecordsTable({ departmentId = null }) {
  const { attendance, deleteAttendance } = useContext(AttendanceContext);
  const { employees } = useContext(EmployeeContext);
  const { user } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);
  const { can } = usePermissions();

  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  const canDelete = can(MODULES.ATTENDANCE, ACTIONS.DELETE);
  const canExport = can(MODULES.ATTENDANCE, ACTIONS.EXPORT);

  function employeeOf(id) {
    return employees.find((e) => e.id === id);
  }

  const scopedIds = departmentId
    ? new Set(employees.filter((e) => e.departmentId === departmentId).map((e) => e.id))
    : null;

  const filtered = attendance.filter((r) => {
    if (scopedIds && !scopedIds.has(r.employeeId)) return false;
    return (!statusFilter || r.status === statusFilter) && (!dateFilter || r.date === dateFilter);
  });

  function handleExport() {
    exportToCSV(
      "attendance-report",
      ["Employee", "Date", "Check In", "Check Out", "Hours", "Overtime", "Status", "Office"],
      filtered.map((r) => {
        const e = employeeOf(r.employeeId);
        return [
          e ? `${e.firstName} ${e.lastName}` : "Unknown",
          r.date, r.checkIn, r.checkOut || "--", r.totalHours, r.overtime, r.status,
          r.insideOffice ? "Verified" : "Outside",
        ];
      })
    );
  }

  function handleDelete() {
    deleteAttendance(confirmId);
    toast({ title: "Attendance record deleted" });
    setConfirmId(null);
  }

  const columns = [
    {
      key: "employee", header: "Employee",
      render: (row) => {
        const e = employeeOf(row.employeeId);
        return (
          <div className="flex items-center gap-2.5">
            <Avatar firstName={e?.firstName} lastName={e?.lastName} color={e?.avatarColor} size={30} />
            <span className="font-medium">{e ? `${e.firstName} ${e.lastName}` : "Unknown"}</span>
          </div>
        );
      },
    },
    { key: "date", header: "Date", sortable: true },
    { key: "checkIn", header: "Check In" },
    { key: "checkOut", header: "Check Out", render: (r) => r.checkOut || "--" },
    { key: "totalHours", header: "Hours", sortable: true },
    { key: "overtime", header: "OT" },
    { key: "status", header: "Status", render: (r) => <Badge tone={r.status}>{r.status}</Badge> },
    {
      key: "office", header: "Office",
      render: (r) => (
        <span className={`flex items-center gap-1 text-xs ${r.insideOffice ? "text-emerald-500" : "text-red-500"}`}>
          <MapPin className="h-3 w-3" /> {r.insideOffice ? "Verified" : "Outside"}
        </span>
      ),
    },
  ];

  if (canDelete) {
    columns.push({
      key: "actions", header: "",
      render: (row) => (
        <button onClick={() => setConfirmId(row.id)} className="rounded-lg p-1.5 text-secondary hover:bg-red-500/10 hover:text-red-500">
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance records</CardTitle>
        {canExport && <Button variant="secondary" size="sm" icon={Download} onClick={handleExport}>Export CSV</Button>}
      </CardHeader>
      <CardBody>
        <DataTable
          columns={columns}
          data={filtered}
          searchKeys={[]}
          searchable={false}
          pageSize={8}
          emptyTitle="No attendance records"
          extraFilters={
            <div className="flex gap-3">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                placeholder="All status"
                options={["Checked In", "Present", "Late", "Absent", "Half Day"]}
                className="w-40"
              />
              <Input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-40" />
            </div>
          }
        />
      </CardBody>

      <ConfirmDialog
        open={Boolean(confirmId)} onClose={() => setConfirmId(null)} onConfirm={handleDelete}
        title="Delete attendance record" description="This record will be permanently removed."
      />
    </Card>
  );
}
