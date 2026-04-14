import privateAxios from "@/lib/privateAxios";
import type { CreateNotificationPayload, Notification } from "@/types/notifications/types";

const NOTIFICATION_PATH = "/api/notifications";

export const createNotification = async (payload: CreateNotificationPayload): Promise<Notification> => {
  const response = await privateAxios.post<Notification>(NOTIFICATION_PATH, payload);
  return response.data;
};

export const getNotifications = async (userId: string): Promise<Notification[]> => {
  const response = await privateAxios.get<Notification[]>(`${NOTIFICATION_PATH}/${userId}`);
  return response.data;
};

export const getUnreadNotifications = async (userId: string): Promise<Notification[]> => {
  const response = await privateAxios.get<Notification[]>(`${NOTIFICATION_PATH}/${userId}/unread`);
  return response.data;
};

export const getTodayNotifications = async (userId: string): Promise<Notification[]> => {
  const response = await privateAxios.get<Notification[]>(`${NOTIFICATION_PATH}/${userId}/today`);
  return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
  const response = await privateAxios.patch<Notification>(`${NOTIFICATION_PATH}/${notificationId}/read`);
  return response.data;
};
