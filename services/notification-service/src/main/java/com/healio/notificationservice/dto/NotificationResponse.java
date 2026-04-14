package com.healio.notificationservice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.healio.notificationservice.enums.NotificationRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NotificationResponse {

    private String id;
    private String userId;
    private NotificationRole role;
    private String type;
    private String title;
    private String message;

    @JsonProperty("isRead")
    private boolean isRead;
    private String referenceId;
    private String sourceService;
    private String actionUrl;
    private LocalDateTime scheduledFor;
    private LocalDateTime createdAt;
}
