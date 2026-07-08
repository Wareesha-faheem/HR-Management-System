"use client";

import { useContext, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, LogOut, User as UserIcon, Check } from "lucide-react";
import AuthContext from "@/contexts/AuthContext";
import NotificationContext from "@/contexts/NotificationContext";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Avatar from "@/components/ui/Avatar";
import { timeAgo } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const TYPE_ROUTE_FALLBACK = {
  leave: "/leave",
  attendance: "/attendance",
  payroll: "/payroll",
  recruitment: "/recruitment",
  employee: "/employees",
  notice: "/dashboard",
};

export default function Topbar({ onOpenMobileSidebar }) {
  const { user, logout } = useContext(AuthContext);
  const { notifications, unreadCount, markRead, markAllRead } = useContext(NotificationContext);
  const router = useRouter();

  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  function handleNotificationClick(n) {
    markRead(n.id);
    setNotifOpen(false);
    const target = n.link || TYPE_ROUTE_FALLBACK[n.type];
    if (target) router.push(target);
  }

  return (
    <header className="no-print sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-[rgb(var(--border-subtle))] bg-surface px-4 sm:px-6 lg:px-8">
      <button
        onClick={onOpenMobileSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-md text-secondary hover:bg-surface-2 hover:text-primary transition-colors lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden lg:block flex-1" />

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-md border transition-colors",
              notifOpen
                ? "border-brand/40 text-brand"
                : "border-[rgb(var(--border-subtle))] text-secondary hover:text-brand"
            )}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-semibold leading-none text-white ring-2 ring-[rgb(var(--bg-surface))]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-[rgb(var(--border-subtle))] bg-surface shadow-sm overflow-hidden">
              <div className="flex items-center justify-between border-b border-[rgb(var(--border-subtle))] px-4 py-3">
                <p className="text-sm font-semibold text-primary">Notifications</p>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
                    <Check className="h-3 w-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-secondary">You're all caught up.</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={cn(
                        "block w-full px-4 py-3 text-left border-b border-[rgb(var(--border-subtle))] last:border-0 hover:bg-surface-2 transition-colors",
                        !n.read && "bg-surface-2"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-primary">{n.title}</p>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand mt-1.5 flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-secondary mt-0.5">{n.message}</p>
                      <p className="text-[11px] text-secondary/70 mt-1">{timeAgo(n.createdAt)}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-0.5 hidden h-7 w-px bg-[rgb(var(--border-subtle))] sm:block" />

        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserOpen((v) => !v)}
            className={cn(
              "flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors",
              userOpen ? "bg-surface-2" : "hover:bg-surface-2"
            )}
          >
            <Avatar firstName={user?.firstName} lastName={user?.lastName} color={user?.avatarColor} size={32} />
            <div className="hidden text-left sm:block">
              <p className="text-xs font-medium text-primary leading-none">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-secondary leading-none mt-1">{user?.role}</p>
            </div>
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[rgb(var(--border-subtle))] bg-surface shadow-sm overflow-hidden py-1">
              <button
                onClick={() => { setUserOpen(false); router.push("/settings"); }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-primary hover:bg-surface-2 transition-colors"
              >
                <UserIcon className="h-4 w-4 text-secondary" /> Profile & Settings
              </button>
              <div className="my-1 h-px bg-[rgb(var(--border-subtle))]" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}