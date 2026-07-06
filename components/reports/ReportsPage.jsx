"use client";

import { useContext, useMemo, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Legend, LineChart, Line,
} from "recharts";
import { Download, FileSpreadsheet, FileText, Building2 } from "lucide-react";

import EmployeeContext from "@/contexts/EmployeeContext";
import DepartmentContext from "@/contexts/DepartmentContext";
import AttendanceContext from "@/contexts/AttendanceContext";
import LeaveContext from "@/contexts/LeaveContext";
import PayrollContext from "@/contexts/PayrollContext";
import { usePermissions } from "@/hooks/usePermissions";
import { useChartTheme } from "@/hooks/useChartTheme";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import DateRangeFilter, { isoDaysAgo } from "./DateRangeFilter";
import ReportSummaryCards from "./ReportSummaryCards";
import DepartmentDetailModal from "./DepartmentDetailModal";

import { MODULES, ACTIONS } from "@/utils/rbac";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { exportToCSV } from "@/utils/exportCSV";
import { exportToExcel } from "@/utils/exportExcel";
import { getCurrentDate } from "@/utils/attendanceUtils";

const COLORS = ["#0B2A9C", "#1E5EFF", "#22B2FF", "#7C3AED", "#F59E0B", "#10B981"];

export default function ReportsPage() {
  const { employees } = useContext(EmployeeContext);
  const { departments, getDepartmentById } = useContext(DepartmentContext);
  const { attendance } = useContext(AttendanceContext);
  const { leaves } = useContext(LeaveContext);
  const { payroll } = useContext(PayrollContext);
  const { can } = usePermissions();

  const canExport = can(MODULES.REPORTS, ACTIONS.EXPORT);
  const chartTheme = useChartTheme();

  const [range, setRange] = useState({ startDate: isoDaysAgo(30), endDate: getCurrentDate() });
  const [preset, setPreset] = useState(30);
  const [detailDept, setDetailDept] = useState(null);
  const [pdfExporting, setPdfExporting] = useState(false);

  function handlePreset(days) {
    setPreset(days);
    setRange({ startDate: isoDaysAgo(days), endDate: getCurrentDate() });
  }

  function handleRangeChange(next) {
    setPreset(null);
    setRange(next);
  }

  const inRange = (dateStr) => dateStr >= range.startDate && dateStr <= range.endDate;

  const filteredAttendance = useMemo(() => attendance.filter((a) => inRange(a.date)), [attendance, range]);
  const filteredLeaves = useMemo(() => leaves.filter((l) => inRange(l.appliedOn)), [leaves, range]);

  // Previous period of equal length, for trend deltas.
  const periodDays = Math.max(1, Math.round((new Date(range.endDate) - new Date(range.startDate)) / 86400000) + 1);
  const prevEnd = new Date(range.startDate);
  prevEnd.setDate(prevEnd.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevStart.getDate() - periodDays + 1);
  const prevStartStr = prevStart.toISOString().split("T")[0];
  const prevEndStr = prevEnd.toISOString().split("T")[0];
  const prevAttendance = useMemo(
    () => attendance.filter((a) => a.date >= prevStartStr && a.date <= prevEndStr),
    [attendance, prevStartStr, prevEndStr]
  );

  function attendanceRateOf(records) {
    const workingDays = new Set(records.map((r) => r.date)).size || 1;
    const denominator = employees.length * workingDays;
    return denominator ? Math.round((records.length / denominator) * 100) : 0;
  }

  const currentRate = attendanceRateOf(filteredAttendance);
  const prevRate = attendanceRateOf(prevAttendance);
  const rateDelta = prevRate ? Number((currentRate - prevRate).toFixed(1)) : null;

  const lateCount = filteredAttendance.filter((a) => a.status === "Late").length;
  const prevLateCount = prevAttendance.filter((a) => a.status === "Late").length;
  const lateDelta = prevLateCount ? Number((((lateCount - prevLateCount) / prevLateCount) * 100).toFixed(1)) : null;

  const today = getCurrentDate();
  const todayAttendance = attendance.filter((a) => a.date === today);
  const absentToday = Math.max(0, employees.length - todayAttendance.length);

  const monthsSorted = [...new Set(payroll.map((p) => p.month))].sort((a, b) => new Date(a) - new Date(b));
  const currentMonth = monthsSorted[monthsSorted.length - 1];
  const prevMonth = monthsSorted[monthsSorted.length - 2];
  const thisMonthPayroll = payroll.filter((p) => p.month === currentMonth).reduce((s, p) => s + p.netSalary, 0);
  const prevMonthPayroll = payroll.filter((p) => p.month === prevMonth).reduce((s, p) => s + p.netSalary, 0);
  const payrollDelta = prevMonthPayroll ? Number((((thisMonthPayroll - prevMonthPayroll) / prevMonthPayroll) * 100).toFixed(1)) : null;

  const metrics = {
    totalEmployees: employees.length,
    attendanceRate: currentRate,
    attendanceRateDelta: rateDelta,
    absentToday,
    lateCount,
    lateDelta,
    pendingLeaves: leaves.filter((l) => l.status === "Pending").length,
    thisMonthPayroll,
    payrollDelta,
  };

  // Multi-line attendance trend across the selected range.
  const trendData = useMemo(() => {
    const days = [...new Set(filteredAttendance.map((a) => a.date))].sort();
    return days.map((date) => {
      const dayRecords = filteredAttendance.filter((a) => a.date === date);
      const present = dayRecords.filter((r) => r.status === "Present").length;
      const late = dayRecords.filter((r) => r.status === "Late").length;
      const absent = Math.max(0, employees.length - dayRecords.length);
      return { date: formatDate(date, { year: undefined }), present, late, absent };
    });
  }, [filteredAttendance, employees.length]);

  const headcountData = departments.map((d) => ({ id: d.id, name: d.name, value: employees.filter((e) => e.departmentId === d.id).length }));

  const leaveTally = {};
  filteredLeaves.forEach((l) => { leaveTally[l.leaveType] = (leaveTally[l.leaveType] || 0) + 1; });
  const leaveData = Object.entries(leaveTally).map(([name, value]) => ({ name, value }));

  const payrollTrend = monthsSorted.map((month) => ({
    month,
    total: payroll.filter((p) => p.month === month).reduce((s, p) => s + p.netSalary, 0),
  }));

  // Department performance table.
  const deptPerformance = departments.map((d) => {
    const deptEmployeeIds = new Set(employees.filter((e) => e.departmentId === d.id).map((e) => e.id));
    const deptAttendance = filteredAttendance.filter((a) => deptEmployeeIds.has(a.employeeId));
    const workingDays = new Set(deptAttendance.map((a) => a.date)).size || 1;
    const denom = deptEmployeeIds.size * workingDays;
    const rate = denom ? Math.round((deptAttendance.length / denom) * 100) : 0;
    const pendingLeaves = leaves.filter((l) => deptEmployeeIds.has(l.employeeId) && l.status === "Pending").length;
    return { ...d, headcount: deptEmployeeIds.size, attendanceRate: rate, pendingLeaves };
  });

  function handleExportCSV() {
    exportToCSV(
      "hrms-summary-report",
      ["Metric", "Value"],
      [
        ["Date range", `${range.startDate} to ${range.endDate}`],
        ["Total Employees", metrics.totalEmployees],
        ["Attendance Rate", `${metrics.attendanceRate}%`],
        ["Absent Today", metrics.absentToday],
        ["Late Arrivals (range)", metrics.lateCount],
        ["Pending Leave Requests", metrics.pendingLeaves],
        [`Payroll (${currentMonth})`, metrics.thisMonthPayroll],
      ]
    );
  }

  async function handleExportExcel() {
    await exportToExcel("hrms-report", [
      {
        name: "Summary",
        headers: ["Metric", "Value"],
        rows: [
          ["Date range", `${range.startDate} to ${range.endDate}`],
          ["Total Employees", metrics.totalEmployees],
          ["Attendance Rate", `${metrics.attendanceRate}%`],
          ["Absent Today", metrics.absentToday],
          ["Late Arrivals (range)", metrics.lateCount],
          ["Pending Leave Requests", metrics.pendingLeaves],
          [`Payroll (${currentMonth})`, metrics.thisMonthPayroll],
        ],
      },
      {
        name: "Department Performance",
        headers: ["Department", "Headcount", "Attendance Rate", "Pending Leaves"],
        rows: deptPerformance.map((d) => [d.name, d.headcount, `${d.attendanceRate}%`, d.pendingLeaves]),
      },
      {
        name: "Attendance (range)",
        headers: ["Date", "Present", "Late", "Absent"],
        rows: trendData.map((r) => [r.date, r.present, r.late, r.absent]),
      },
      {
        name: "Payroll by month",
        headers: ["Month", "Net Payout"],
        rows: payrollTrend.map((r) => [r.month, r.total]),
      },
    ]);
  }

  async function handleExportPDF() {
    setPdfExporting(true);
    try {
      // Both the renderer and the document layout are dynamically imported so
      // this fairly heavy library only ever loads when someone actually clicks
      // "PDF" — it never touches the main app bundle otherwise.
      const [{ pdf }, { default: ReportPDFDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ReportPDFDocument"),
      ]);

      const doc = (
        <ReportPDFDocument
          range={range}
          metrics={metrics}
          deptPerformance={deptPerformance}
          currentMonth={currentMonth}
        />
      );

      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kuickpay-report-${range.startDate}-to-${range.endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setPdfExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Company-wide analytics across headcount, attendance, leave and payroll"
        actions={
          canExport && (
            <div className="no-print flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" icon={Download} onClick={handleExportCSV}>CSV</Button>
              <Button variant="secondary" size="sm" icon={FileSpreadsheet} onClick={handleExportExcel}>Excel</Button>
              <Button variant="secondary" size="sm" icon={FileText} onClick={handleExportPDF} loading={pdfExporting}>PDF</Button>
            </div>
          )
        }
      />

      <div className="no-print">
        <DateRangeFilter
          startDate={range.startDate}
          endDate={range.endDate}
          onChange={handleRangeChange}
          activePreset={preset}
          onPreset={handlePreset}
        />
      </div>

      <ReportSummaryCards metrics={metrics} />

      <Card>
        <CardHeader>
          <CardTitle>Attendance trend</CardTitle>
          <span className="text-xs text-secondary">{range.startDate} → {range.endDate}</span>
        </CardHeader>
        <CardBody className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} stroke={chartTheme.text} />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={chartTheme.text} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.text }} />
              <Legend wrapperStyle={{ fontSize: 12, color: chartTheme.text }} />
              <Line type="monotone" dataKey="present" name="Present" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="late" name="Late" stroke="#F59E0B" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="absent" name="Absent" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Headcount by department</CardTitle>
            <span className="text-xs text-secondary flex items-center gap-1"><Building2 className="h-3 w-3" /> click a slice</span>
          </CardHeader>
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={headcountData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3}
                  onClick={(entry) => setDetailDept(getDepartmentById(entry.id))}
                  cursor="pointer"
                >
                  {headcountData.map((entry, i) => <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.text }} />
                <Legend wrapperStyle={{ fontSize: 12, color: chartTheme.text }} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave requests by type</CardTitle>
            <span className="text-xs text-secondary">{range.startDate} → {range.endDate}</span>
          </CardHeader>
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} stroke={chartTheme.text} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={chartTheme.text} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12, background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.text }} />
                <Bar dataKey="value" fill="#7C3AED" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payroll cost by month</CardTitle>
            {payrollDelta !== null && (
              <Badge tone={payrollDelta >= 0 ? "Approved" : "Rejected"}>
                {payrollDelta >= 0 ? "+" : ""}{payrollDelta}% vs last month
              </Badge>
            )}
          </CardHeader>
          <CardBody className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke={chartTheme.text} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={chartTheme.text} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 12, fontSize: 12, background: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.text }} />
                <Bar dataKey="total" fill="#22B2FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department performance</CardTitle>
          <span className="text-xs text-secondary">click a row for details</span>
        </CardHeader>
        <CardBody>
          <DataTable
            columns={[
              { key: "name", header: "Department", sortable: true },
              { key: "headcount", header: "Headcount", sortable: true },
              {
                key: "attendanceRate", header: "Attendance Rate", sortable: true,
                render: (row) => (
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span className="text-sm text-primary w-10">{row.attendanceRate}%</span>
                    <ProgressBar value={row.attendanceRate} thresholds className="flex-1" />
                  </div>
                ),
              },
              {
                key: "pendingLeaves", header: "Pending Leaves", sortable: true,
                render: (row) => row.pendingLeaves > 0 ? <Badge tone="Pending">{row.pendingLeaves}</Badge> : <span className="text-secondary">0</span>,
              },
            ]}
            data={deptPerformance}
            searchKeys={["name"]}
            searchPlaceholder="Search departments..."
            pageSize={6}
            onRowClick={(row) => setDetailDept(getDepartmentById(row.id))}
          />
        </CardBody>
      </Card>

      <DepartmentDetailModal
        open={Boolean(detailDept)}
        onClose={() => setDetailDept(null)}
        department={detailDept}
        attendanceRate={detailDept ? deptPerformance.find((d) => d.id === detailDept.id)?.attendanceRate ?? 0 : 0}
      />
    </div>
  );
}
