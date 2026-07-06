"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { useChartTheme } from "@/hooks/useChartTheme";

export default function AttendanceTrendChart({ attendance }) {
  const chartTheme = useChartTheme();
  const days = [...new Set(attendance.map((a) => a.date))].sort().slice(-14);

  const data = days.map((date) => {
    const dayRecords = attendance.filter((a) => a.date === date);
    const present = dayRecords.filter((r) => ["Present", "Late", "Checked In"].includes(r.status)).length;
    return {
      date: new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      present,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance trend (last 14 working days)</CardTitle>
      </CardHeader>
      <CardBody className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1E5EFF" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#1E5EFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
            <XAxis dataKey="date" fontSize={11} tickLine={false} axisLine={false} stroke={chartTheme.text} />
            <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={chartTheme.text} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: `1px solid ${chartTheme.tooltipBorder}`, fontSize: 12, background: chartTheme.tooltipBg, color: chartTheme.text }}
            />
            <Area type="monotone" dataKey="present" stroke="#1E5EFF" strokeWidth={2} fill="url(#presentFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
