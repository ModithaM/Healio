"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  getNotifications,
  getTodayNotifications,
  markNotificationAsRead,
} from "@/service/notificationService";
import type { Notification } from "@/types/notifications/types";

type UseNotificationsOptions = {
  userId?: string;
  enabled?: boolean;
  pollingMs?: number;
};

const mergeNotifications = (notifications: Notification[], todayNotifications: Notification[]) => {
  const byId = new Map<string, Notification>();
  [...todayNotifications, ...notifications].forEach((notification) => {
    byId.set(notification.id, notification);
  });

  return Array.from(byId.values()).sort(
    (current, next) => new Date(next.createdAt).getTime() - new Date(current.createdAt).getTime()
  );
};

export function useNotifications({
  userId,
  enabled = true,
  pollingMs = 15000,
}: UseNotificationsOptions) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!enabled || !userId) {
      setNotifications([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [allNotifications, todayNotifications] = await Promise.all([
        getNotifications(userId),
        getTodayNotifications(userId),
      ]);
      setNotifications(mergeNotifications(allNotifications, todayNotifications));
    } catch {
      setError("Unable to load notifications.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, userId]);

  useEffect(() => {
    void loadNotifications();

    if (!enabled || !userId || pollingMs <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void loadNotifications();
    }, pollingMs);

    return () => window.clearInterval(intervalId);
  }, [enabled, loadNotifications, pollingMs, userId]);

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  );

  const markAsRead = useCallback(async (notificationId: string) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      )
    );

    try {
      const updatedNotification = await markNotificationAsRead(notificationId);
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId ? updatedNotification : notification
        )
      );
    } catch {
      setError("Unable to mark notification as read.");
      void loadNotifications();
    }
  }, [loadNotifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refetch: loadNotifications,
    markAsRead,
  };
}
