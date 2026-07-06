"use client";

import { useContext } from "react";
import { Eye, X } from "lucide-react";
import AuthContext from "@/contexts/AuthContext";

export default function ImpersonationBanner() {
  const { user, isImpersonating, stopImpersonation } = useContext(AuthContext);

  if (!isImpersonating) return null;

  return (
    <div className="no-print flex items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-sm font-medium text-navy-950">
      <Eye className="h-4 w-4" />
      <span>
        Previewing as <strong>{user.firstName} {user.lastName}</strong> ({user.role})
      </span>
      <button
        onClick={stopImpersonation}
        className="ml-2 inline-flex items-center gap-1 rounded-full bg-navy-950/10 px-2.5 py-1 hover:bg-navy-950/20 transition-colors"
      >
        <X className="h-3.5 w-3.5" /> Exit preview
      </button>
    </div>
  );
}
