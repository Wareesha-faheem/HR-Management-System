"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

function toLabel(segment) {
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="mb-2 flex items-center gap-1.5 text-xs text-secondary">
      <Link href="/dashboard" className="hover:text-brand">Home</Link>
      {segments.map((seg, i) => {
        const href = `/${segments.slice(0, i + 1).join("/")}`;
        const isLast = i === segments.length - 1;
        return (
          <span key={href} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3" />
            {isLast ? (
              <span className="text-primary font-medium">{toLabel(seg)}</span>
            ) : (
              <Link href={href} className="hover:text-brand">{toLabel(seg)}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
