package com.healio.notificationservice.service;

import com.healio.notificationservice.dto.CreateNotificationRequest;
import com.healio.notificationservice.dto.NotificationResponse;
import com.healio.notificationservice.dto.SessionNotificationRequest;
import com.healio.notificationservice.dto.SessionNotificationResponse;

import java.util.List;

public interface NotificationService {

    NotificationResponse createNotification(CreateNotificationRequest request);

    SessionNotificationResponse createSessionNotification(SessionNotificationRequest request);

    List<NotificationResponse> getNotifications(String userId);

    List<NotificationResponse> getUnreadNotifications(String userId);

    List<NotificationResponse> getTodayNotifications(String userId);

    NotificationResponse markAsRead(String id);
}
