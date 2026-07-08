"use client";

import { useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import AuthContext from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Breadcrumbs from "./Breadcrumbs";
import ImpersonationBanner from "./ImpersonationBanner";
import Button from "@/components/ui/Button";

export default function AppShell({ children }) {
  const { user, loading } = useContext(AuthContext);
  const { canAccessRoute } = usePermissions();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-navy-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-md border-2 border-brand border-t-transparent animate-spin" />
          <p className="text-sm text-white/60">Loading Kuickpay HRMS...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const allowed = canAccessRoute(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-[rgb(var(--bg-app))]">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="relative flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
        <ImpersonationBanner />
        <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />

        <main className="print-area relative flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <div className="no-print"><Breadcrumbs /></div>
          {allowed ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-[rgb(var(--border-subtle))] bg-surface py-24 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-red-500/30 text-red-500">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold text-primary">Access restricted</p>
                <p className="mt-1 text-sm text-secondary max-w-sm">
                  Your role ({user.role}) doesn't have permission to view this module.
                </p>
              </div>
              <Button variant="secondary" onClick={() => router.push("/dashboard")}>
                Back to Dashboard
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}