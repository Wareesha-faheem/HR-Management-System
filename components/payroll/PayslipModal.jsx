"use client";

import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { formatCurrency } from "@/utils/formatters";

export default function PayslipModal({ open, onClose, record, employee }) {
  if (!record) return null;

  const rows = [
    { label: "Basic salary", value: record.basicSalary },
    { label: "Allowances", value: record.allowances, positive: true },
    { label: "Deductions", value: -record.deductions },
    { label: "Tax", value: -record.tax },
  ];

  return (
    <Modal open={open} onClose={onClose} title={`Payslip · ${record.month}`} size="sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-primary">{employee?.firstName} {employee?.lastName}</p>
            <p className="text-xs text-secondary">{employee?.designation}</p>
          </div>
          <Badge tone={record.paymentStatus}>{record.paymentStatus}</Badge>
        </div>

        <div className="rounded-xl border border-[rgb(var(--border-subtle))] divide-y divide-[rgb(var(--border-subtle))]">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-secondary">{row.label}</span>
              <span className={row.value < 0 ? "text-red-500" : "text-primary"}>
                {row.value < 0 ? "-" : ""}{formatCurrency(Math.abs(row.value))}
              </span>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 bg-surface-2 font-semibold">
            <span className="text-primary">Net salary</span>
            <span className="text-brand">{formatCurrency(record.netSalary)}</span>
          </div>
        </div>

        {record.paymentDate && (
          <p className="text-xs text-secondary">Paid on {record.paymentDate}</p>
        )}
      </div>
    </Modal>
  );
}
