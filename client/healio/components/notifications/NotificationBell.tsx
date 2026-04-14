"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";

import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import type { Notification } from "@/types/notifications/types";

type NotificationBellProps = {
  dashboardHref: string;
  badgeClassName?: string;
};

export function NotificationBell({ dashboardHref, badgeClassName }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    markAsRead,
  } = useNotifications({ userId: user?.userId, enabled: Boolean(user?.userId) });

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    setIsOpen(false);
    router.push(resolveNotificationHref(notification, dashboardHref));
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="relative grid h-12 w-12 place-items-center rounded-2xl border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:text-sky-600 hover:shadow-lg dark:border-white/10 dark:bg-white/8 dark:text-slate-200 dark:hover:text-sky-200"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className={cn("absolute right-1.5 top-1.5 grid min-h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950", badgeClassName ?? "bg-emerald-400")}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <NotificationDropdown
            notifications={notifications}
            isLoading={isLoading}
            error={error}
            onNotificationClick={handleNotificationClick}
            onRefresh={() => void refetch()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function resolveNotificationHref(notification: Notification, dashboardHref: string) {
  if (notification.actionUrl) {
    return notification.actionUrl;
  }

  if (notification.sourceService === "telemedicine-service") {
    return `${dashboardHref}?sessionId=${notification.referenceId}`;
  }

  return dashboardHref;
}
