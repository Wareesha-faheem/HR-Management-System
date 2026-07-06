"use client";

import { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, Fingerprint, CalendarDays,
  Wallet, BriefcaseBusiness, BarChart3, Settings, X,
} from "lucide-react";
import AuthContext from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { getAccessibleNavItems } from "@/utils/rbac";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";

const ICONS = {
  LayoutDashboard, Users, Building2, Fingerprint, CalendarDays,
  Wallet, BriefcaseBusiness, BarChart3, Settings,
};

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const { user } = useContext(AuthContext);
  const { overrides } = usePermissions();
  const pathname = usePathname();
  const navItems = getAccessibleNavItems(user?.role, overrides);

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-navy-950/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-navy-950 text-white transition-transform overflow-hidden",
          "lg:static lg:h-full lg:flex-shrink-0 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ambient brand glow, echoes the login screen's identity */}
        <div className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-brand-dark/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -right-20 h-56 w-56 rounded-full bg-brand-light/10 blur-3xl" />

        <div className="relative flex items-center justify-between px-6 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <img src="/logo-mark.png" alt="Kuickpay" className="h-9 w-9 rounded-xl shadow-glow-brand" />
            <div>
              <p className="text-sm font-bold font-display leading-none tracking-tight">Kuickpay</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 leading-none mt-1.5">HR Platform</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-white/60">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative mx-6 mb-2 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent" />

        <nav className="relative flex-1 overflow-y-auto px-4 py-3 space-y-0.5">
          <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">Workspace</p>
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-brand-light to-brand" />
                )}
                <span
                  className={cn(
                    "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                    active ? "bg-brand-gradient shadow-glow-brand" : "bg-white/5 group-hover:bg-white/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="relative mx-4 mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2.5">
            <Avatar firstName={user?.firstName} lastName={user?.lastName} color={user?.avatarColor} size={36} />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
