package com.healio.notificationservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SessionNotificationResponse {

    private NotificationResponse notification;
    private boolean smsSent;
    private String message;
}
