package com.healio.notificationservice.service.impl;

import com.healio.notificationservice.dto.CreateNotificationRequest;
import com.healio.notificationservice.dto.NotificationResponse;
import com.healio.notificationservice.dto.SessionNotificationRequest;
import com.healio.notificationservice.dto.SessionNotificationResponse;
import com.healio.notificationservice.entity.Notification;
import com.healio.notificationservice.enums.NotificationRole;
import com.healio.notificationservice.repository.NotificationRepository;
import com.healio.notificationservice.service.NotificationService;
import com.healio.notificationservice.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {
    private static final String TELEMEDICINE_SOURCE = "telemedicine-service";
    private static final String SESSION_CREATED_TYPE = "SESSION_CREATED";
    private static final DateTimeFormatter SESSION_TIME_FORMATTER = DateTimeFormatter.ofPattern("MMM d, yyyy 'at' h:mm a");

    private final NotificationRepository notificationRepository;
    private final SmsService smsService;

    @Override
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        return toResponse(saveNotification(request));
    }

    @Override
    public SessionNotificationResponse createSessionNotification(SessionNotificationRequest request) {
        NotificationResponse notificationResponse = toResponse(saveNotification(buildSessionCreatedNotification(request)));

        try {
            smsService.sendSessionReminder(request.getPhoneNumber(), request.getSessionTitle(), request.getScheduledTime());
            log.info("Session-created SMS sent for user {} to {}", request.getUserId(), request.getPhoneNumber());
            return SessionNotificationResponse.builder()
                    .notification(notificationResponse)
                    .smsSent(true)
                    .message("SMS sent successfully")
                    .build();
        } catch (RuntimeException exception) {
            log.warn("Session-created SMS failed for user {} to {}", request.getUserId(), request.getPhoneNumber(), exception);
            return SessionNotificationResponse.builder()
                    .notification(notificationResponse)
                    .smsSent(false)
                    .message("Failed to send SMS: " + exception.getMessage())
                    .build();
        }
    }

    private Notification saveNotification(CreateNotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .role(request.getRole())
                .type(request.getType())
                .title(request.getTitle())
                .message(request.getMessage())
                .referenceId(request.getReferenceId())
                .sourceService(request.getSourceService() == null || request.getSourceService().isBlank()
                        ? "general"
                        : request.getSourceService())
                .actionUrl(request.getActionUrl())
                .scheduledFor(request.getScheduledFor())
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getTodayNotifications(String userId) {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.plusDays(1).atStartOfDay();
        return notificationRepository.findByUserIdAndScheduledForBetweenOrderByScheduledForAscCreatedAtDesc(userId, start, end).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public NotificationResponse markAsRead(String id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Notification not found: " + id));
        notification.setRead(true);
        return toResponse(notificationRepository.save(notification));
    }

    private NotificationResponse toResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUserId())
                .role(notification.getRole())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .referenceId(notification.getReferenceId())
                .sourceService(notification.getSourceService() == null || notification.getSourceService().isBlank()
                        ? "general"
                        : notification.getSourceService())
                .actionUrl(notification.getActionUrl())
                .scheduledFor(notification.getScheduledFor())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    private CreateNotificationRequest buildSessionCreatedNotification(SessionNotificationRequest request) {
        String formattedTime = request.getScheduledTime().format(SESSION_TIME_FORMATTER);
        return CreateNotificationRequest.builder()
                .userId(request.getUserId())
                .role(NotificationRole.PATIENT)
                .type(SESSION_CREATED_TYPE)
                .title("Telemedicine Session Scheduled")
                .message("Your telemedicine session \"" + request.getSessionTitle() + "\" is scheduled for " + formattedTime + ".")
                .referenceId(request.getReferenceId() == null || request.getReferenceId().isBlank()
                        ? request.getUserId() + "-" + request.getScheduledTime()
                        : request.getReferenceId())
                .sourceService(request.getSourceService() == null || request.getSourceService().isBlank()
                        ? TELEMEDICINE_SOURCE
                        : request.getSourceService())
                .actionUrl(request.getActionUrl() == null || request.getActionUrl().isBlank()
                        ? "/patient-dashboard"
                        : request.getActionUrl())
                .scheduledFor(request.getScheduledTime())
                .build();
    }
}
