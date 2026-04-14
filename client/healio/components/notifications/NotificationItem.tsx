"use client";

import { Clock3 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Notification } from "@/types/notifications/types";

type NotificationItemProps = {
  notification: Notification;
  onClick: (notification: Notification) => void;
};

const formatRelativeTime = (dateValue: string) => {
  const diffMs = Date.now() - new Date(dateValue).getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={cn(
        "flex w-full gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-sky-50 dark:hover:bg-sky-400/10",
        !notification.isRead && "bg-sky-50/80 dark:bg-sky-400/10"
      )}
    >
      <span
        className={cn(
          "mt-1 h-2.5 w-2.5 shrink-0 rounded-full",
          notification.isRead ? "bg-slate-300 dark:bg-slate-600" : "bg-emerald-400"
        )}
      />
      <span className="min-w-0 flex-1">
        <span className={cn("block text-sm text-slate-800 dark:text-slate-100", !notification.isRead && "font-bold")}>
          {notification.title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
          {notification.message}
        </span>
        <span className="mt-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
          <Clock3 className="h-3.5 w-3.5" />
          {formatRelativeTime(notification.createdAt)}
        </span>
      </span>
    </button>
  );
}
