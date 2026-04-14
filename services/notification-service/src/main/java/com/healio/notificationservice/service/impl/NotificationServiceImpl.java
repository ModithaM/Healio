package com.healio.notificationservice.service.impl;

import com.healio.notificationservice.dto.CreateNotificationRequest;
import com.healio.notificationservice.dto.NotificationResponse;
import com.healio.notificationservice.entity.Notification;
import com.healio.notificationservice.repository.NotificationRepository;
import com.healio.notificationservice.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    public NotificationResponse createNotification(CreateNotificationRequest request) {
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

        return toResponse(notificationRepository.save(notification));
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
}
