"use client";

import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(function Textarea(
  { label, error, className, id, required, rows = 4, ...props },
  ref
) {
  const areaId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={areaId} className="text-sm font-medium text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        className={cn(
          "w-full resize-none rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-primary placeholder:text-secondary/60 outline-none transition-colors",
          "border-[rgb(var(--border-subtle))] focus:border-brand focus:ring-2 focus:ring-brand/20",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Textarea;
