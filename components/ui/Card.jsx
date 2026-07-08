"use client";

import { cn } from "@/utils/cn";

export function Card({ className, children, glass = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[rgb(var(--border-subtle))]",
        glass ? "glass-panel shadow-glass" : "bg-surface",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 p-5 pb-3", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-base font-semibold font-display text-primary", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("p-5 pt-2", className)} {...props}>
      {children}
    </div>
  );
}
