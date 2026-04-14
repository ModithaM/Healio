"use client";

import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import type { Notification } from "@/types/notifications/types";

type NotificationDropdownProps = {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  onNotificationClick: (notification: Notification) => void;
  onRefresh: () => void;
};

export function NotificationDropdown({
  notifications,
  isLoading,
  error,
  onNotificationClick,
  onRefresh,
}: NotificationDropdownProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute right-0 top-14 z-50 w-[min(22rem,calc(100vw-2rem))] origin-top-right rounded-lg border border-slate-200/80 bg-white/95 p-3 shadow-2xl shadow-sky-950/12 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95"
    >
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-3 dark:border-white/10">
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Notifications</p>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Telemedicine updates and reminders
          </p>
        </div>
        <Button type="button" variant="outline" size="icon" className="h-9 w-9 rounded-lg" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-2 max-h-[24rem] overflow-y-auto">
        {isLoading && notifications.length === 0 && (
          <p className="px-3 py-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            Loading notifications...
          </p>
        )}

        {error && notifications.length === 0 && (
          <p className="px-3 py-8 text-center text-sm font-semibold text-rose-500">
            {error}
          </p>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <p className="px-3 py-8 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            No notifications yet.
          </p>
        )}

        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={onNotificationClick}
          />
        ))}
      </div>
    </motion.div>
  );
}
