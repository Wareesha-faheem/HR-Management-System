"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const VARIANTS = {
  primary: "bg-brand text-white hover:brightness-95 active:brightness-90",
  secondary:
    "bg-surface text-primary hover:bg-surface-2 border border-[rgb(var(--border-subtle))]",
  ghost: "bg-transparent text-primary hover:bg-surface-2",
  danger: "bg-red-600 text-white hover:bg-red-500",
  outline: "bg-transparent border border-[rgb(var(--border-subtle))] text-primary hover:bg-surface-2",
};

const SIZES = {
  sm: "h-8 px-3 text-xs rounded-md",
  md: "h-9 px-3.5 text-sm rounded-md",
  lg: "h-10 px-5 text-sm rounded-md",
  icon: "h-9 w-9 rounded-md",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  icon: Icon,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>
  );
}