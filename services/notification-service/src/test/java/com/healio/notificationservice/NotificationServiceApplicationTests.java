package com.healio.notificationservice;

import com.healio.notificationservice.dto.CreateNotificationRequest;
import com.healio.notificationservice.entity.Notification;
import com.healio.notificationservice.enums.NotificationRole;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class NotificationServiceApplicationTests {

    @Test
    void buildsCreateNotificationRequest() {
        LocalDateTime scheduledFor = LocalDateTime.of(2026, 4, 14, 10, 0);
        CreateNotificationRequest request = CreateNotificationRequest.builder()
                .userId("patient-42")
                .role(NotificationRole.PATIENT)
                .type("SESSION_CREATED")
                .title("New Telemedicine Session Scheduled")
                .message("Dr. X has scheduled a session for you at 10:00 AM.")
                .referenceId("session-1001")
                .sourceService("telemedicine-service")
                .actionUrl("/patient-dashboard?sessionId=session-1001")
                .scheduledFor(scheduledFor)
                .build();

        assertThat(request.getUserId()).isEqualTo("patient-42");
        assertThat(request.getRole()).isEqualTo(NotificationRole.PATIENT);
        assertThat(request.getType()).isEqualTo("SESSION_CREATED");
        assertThat(request.getSourceService()).isEqualTo("telemedicine-service");
        assertThat(request.getActionUrl()).isEqualTo("/patient-dashboard?sessionId=session-1001");
        assertThat(request.getScheduledFor()).isEqualTo(scheduledFor);
    }

    @Test
    void notificationDefaultsToUnreadUntilMarkedRead() {
        Notification notification = Notification.builder()
                .id("notification-1")
                .userId("doctor-17")
                .role(NotificationRole.DOCTOR)
                .type("SESSION_TODAY")
                .title("Telemedicine Session Today")
                .message("A session is scheduled today.")
                .referenceId("session-1001")
                .sourceService("telemedicine-service")
                .actionUrl("/doctor-dashboard?sessionId=session-1001")
                .scheduledFor(LocalDateTime.of(2026, 4, 14, 10, 0))
                .isRead(false)
                .build();

        assertThat(notification.isRead()).isFalse();
        notification.setRead(true);
        assertThat(notification.isRead()).isTrue();
    }
}
