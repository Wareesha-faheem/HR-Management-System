"use client";

import { cn } from "@/utils/cn";

const STATUS_STYLES = {
  Active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  "On Leave": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Inactive: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Present: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Late: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Absent: "bg-red-500/10 text-red-500 border-red-500/20",
  "Half Day": "bg-orange-500/10 text-orange-500 border-orange-500/20",
  "Checked In": "bg-sky-500/10 text-sky-500 border-sky-500/20",
  Pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  Paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Applied: "bg-sky-500/10 text-sky-500 border-sky-500/20",
  Screening: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Interview: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Offer: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hired: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  default: "bg-brand/10 text-brand border-brand/20",
};

export default function Badge({ children, tone, className }) {
  const style = STATUS_STYLES[tone ?? children] || STATUS_STYLES.default;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style,
        className
      )}
    >
      {children}
    </span>
  );
}
