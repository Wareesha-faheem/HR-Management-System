"use client";

import { useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, Fingerprint, CalendarDays,
  Wallet, BriefcaseBusiness, BarChart3, Settings, X, KanbanSquare, ListTodo,
} from "lucide-react";
import AuthContext from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { getAccessibleNavItems } from "@/utils/rbac";
import Avatar from "@/components/ui/Avatar";
import { cn } from "@/utils/cn";

const ICONS = {
  LayoutDashboard, Users, Building2, Fingerprint, CalendarDays,
  Wallet, BriefcaseBusiness, BarChart3, Settings, KanbanSquare, ListTodo,
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
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={cn(
          "no-print fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-navy-950 text-white transition-transform",
          "lg:static lg:h-full lg:flex-shrink-0 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img src="/logo-mark.png" alt="Kuickpay" className="h-7 w-7 rounded-md" />
            <div>
              <p className="text-[13px] font-semibold leading-none">Kuickpay</p>
              <p className="text-[10px] text-white/40 leading-none mt-1">HR Platform</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-white/50">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <p className="px-2 pb-1.5 text-[10px] font-medium uppercase tracking-wide text-white/30">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = ICONS[item.icon];
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium border-l-2 transition-colors",
                  active
                    ? "bg-white/[0.06] border-brand text-white"
                    : "border-transparent text-white/55 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-white/10 px-3 py-3">
          <div className="flex items-center gap-2.5">
            <Avatar firstName={user?.firstName} lastName={user?.lastName} color={user?.avatarColor} size={30} />
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] text-white/40 truncate">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}