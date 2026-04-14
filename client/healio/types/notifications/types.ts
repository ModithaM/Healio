export type NotificationRole = "PATIENT" | "DOCTOR";

export type NotificationType = string;

export type Notification = {
  id: string;
  userId: string;
  role: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  referenceId: string;
  sourceService: string;
  actionUrl?: string | null;
  scheduledFor?: string | null;
  createdAt: string;
};

export type CreateNotificationPayload = {
  userId: string;
  role: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  referenceId: string;
  sourceService?: string;
  actionUrl?: string;
  scheduledFor?: string;
};
