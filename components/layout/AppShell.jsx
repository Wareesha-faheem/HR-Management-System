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

// Wraps every authenticated page. Handles:
//  1. redirecting unauthenticated visitors to /login
//  2. showing a loading state while the session hydrates
//  3. blocking access at the route level for roles without permission (RBAC),
//     accounting for any per-user overrides a Super Admin has granted
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
          <div className="h-10 w-10 rounded-xl bg-brand-gradient animate-pulse shadow-glow-brand" />
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

      {/* This column owns the ONLY scrollbar in the app shell — the sidebar
          is a plain full-height flex sibling, so it never scrolls with the
          page and never leaves whitespace beneath it on tall pages. */}
      <div className="relative flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto">
        {/* Faint brand-gradient atmosphere, echoing the login screen, so
            interior pages don't read as a flat generic admin panel. */}
        <div className="no-print pointer-events-none fixed -top-32 right-0 h-96 w-96 rounded-full bg-brand/[0.06] dark:bg-brand/[0.10] blur-3xl" />
        <div className="no-print pointer-events-none fixed bottom-0 left-1/3 h-80 w-80 rounded-full bg-brand-light/[0.05] dark:bg-brand-light/[0.08] blur-3xl" />

        <ImpersonationBanner />
        <Topbar onOpenMobileSidebar={() => setMobileOpen(true)} />

        <main className="print-area relative flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <div className="no-print"><Breadcrumbs /></div>
          {allowed ? (
            children
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl2 border border-[rgb(var(--border-subtle))] bg-surface py-24 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-primary">Access restricted</p>
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
