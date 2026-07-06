"use client";

import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = "Select...", className, id, required, ...props },
  ref
) {
  const selectId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-10 w-full appearance-none rounded-xl border bg-surface px-3.5 pr-9 text-sm text-primary outline-none transition-colors",
            "border-[rgb(var(--border-subtle))] focus:border-brand focus:ring-2 focus:ring-brand/20",
            error && "border-red-500",
            className
          )}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Select;
