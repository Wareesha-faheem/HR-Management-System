"use client";

import { useContext, useState } from "react";
import { Wallet, Download, Eye, CheckCircle2 } from "lucide-react";
import PayrollContext from "@/contexts/PayrollContext";
import EmployeeContext from "@/contexts/EmployeeContext";
import AuthContext from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import ToastContext from "@/contexts/ToastContext";
import NotificationContext from "@/contexts/NotificationContext";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import DataTable from "@/components/ui/DataTable";
import Select from "@/components/ui/Select";
import { Card, CardBody } from "@/components/ui/Card";
import PayslipModal from "./PayslipModal";

import { MODULES, ACTIONS } from "@/utils/rbac";
import { formatCurrency } from "@/utils/formatters";
import { exportToCSV } from "@/utils/exportCSV";

export default function PayrollPage() {
  const { payroll, markPaid } = useContext(PayrollContext);
  const { employees, getEmployeeById } = useContext(EmployeeContext);
  const { user } = useContext(AuthContext);
  const { can } = usePermissions();
  const { toast } = useContext(ToastContext);
  const { pushNotification } = useContext(NotificationContext);

  const [monthFilter, setMonthFilter] = useState("");
  const [viewRecord, setViewRecord] = useState(null);

  const canViewAll = can(MODULES.PAYROLL, ACTIONS.VIEW_ALL);
  const canExport = can(MODULES.PAYROLL, ACTIONS.EXPORT);
  const canEdit = can(MODULES.PAYROLL, ACTIONS.EDIT);

  const scoped = canViewAll ? payroll : payroll.filter((p) => p.employeeId === user.employeeId);
  const filtered = monthFilter ? scoped.filter((p) => p.month === monthFilter) : scoped;
  const months = [...new Set(payroll.map((p) => p.month))];

  const totalPayout = filtered.reduce((sum, p) => sum + p.netSalary, 0);
  const pendingCount = filtered.filter((p) => p.paymentStatus === "Pending").length;

  function handleMarkPaid(id) {
    markPaid(id);
    const record = payroll.find((p) => p.id === id);
    const emp = record ? getEmployeeById(record.employeeId) : null;
    toast({ title: "Marked as paid", variant: "success" });
    pushNotification({
      title: "Salary paid",
      message: emp ? `${emp.firstName} ${emp.lastName}'s ${record.month} salary was marked as paid.` : "A salary run was marked as paid.",
      type: "payroll",
      link: "/payroll",
    });
  }

  function handleExport() {
    exportToCSV(
      "payroll",
      ["Employee", "Month", "Basic", "Allowances", "Deductions", "Tax", "Net Salary", "Status"],
      filtered.map((p) => {
        const e = getEmployeeById(p.employeeId);
        return [e ? `${e.firstName} ${e.lastName}` : "Unknown", p.month, p.basicSalary, p.allowances, p.deductions, p.tax, p.netSalary, p.paymentStatus];
      })
    );
  }

  const columns = [
    ...(canViewAll ? [{
      key: "employee", header: "Employee",
      render: (row) => {
        const e = getEmployeeById(row.employeeId);
        return (
          <div className="flex items-center gap-2.5">
            <Avatar firstName={e?.firstName} lastName={e?.lastName} color={e?.avatarColor} size={30} />
            <span className="font-medium">{e ? `${e.firstName} ${e.lastName}` : "Unknown"}</span>
          </div>
        );
      },
    }] : []),
    { key: "month", header: "Month", sortable: true },
    { key: "netSalary", header: "Net Salary", sortable: true, render: (r) => formatCurrency(r.netSalary) },
    { key: "paymentStatus", header: "Status", render: (r) => <Badge tone={r.paymentStatus}>{r.paymentStatus}</Badge> },
    {
      key: "actions", header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button onClick={() => setViewRecord(row)} className="rounded-lg p-1.5 text-secondary hover:bg-surface-2 hover:text-brand">
            <Eye className="h-4 w-4" />
          </button>
          {canEdit && row.paymentStatus === "Pending" && (
            <button onClick={() => handleMarkPaid(row.id)} className="rounded-lg p-1.5 text-emerald-500 hover:bg-emerald-500/10" title="Mark as paid">
              <CheckCircle2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description={canViewAll ? "Manage salary runs across Kuickpay" : "View your salary history and payslips"}
        actions={canExport && <Button variant="secondary" icon={Download} onClick={handleExport}>Export CSV</Button>}
      />

      {canViewAll && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Card><CardBody><p className="text-xs text-secondary">Total payout ({monthFilter || "all months"})</p><p className="mt-1 text-xl font-bold text-primary">{formatCurrency(totalPayout)}</p></CardBody></Card>
          <Card><CardBody><p className="text-xs text-secondary">Pending payments</p><p className="mt-1 text-xl font-bold text-amber-500">{pendingCount}</p></CardBody></Card>
          <Card><CardBody><p className="text-xs text-secondary">Employees on payroll</p><p className="mt-1 text-xl font-bold text-primary">{employees.length}</p></CardBody></Card>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        searchable={false}
        pageSize={8}
        emptyTitle="No payroll records"
        extraFilters={
          <Select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} placeholder="All months" options={months} className="w-48" />
        }
      />

      <PayslipModal open={Boolean(viewRecord)} onClose={() => setViewRecord(null)} record={viewRecord} employee={viewRecord ? getEmployeeById(viewRecord.employeeId) : null} />
    </div>
  );
}
