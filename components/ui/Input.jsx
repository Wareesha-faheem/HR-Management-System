"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(function Input(
  { label, error, hint, className, id, required, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          "h-10 w-full rounded-xl border bg-surface px-3.5 text-sm text-primary placeholder:text-secondary/60 outline-none transition-colors",
          "border-[rgb(var(--border-subtle))] focus:border-brand focus:ring-2 focus:ring-brand/20",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {hint && !error && <span className="text-xs text-secondary">{hint}</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Input;
