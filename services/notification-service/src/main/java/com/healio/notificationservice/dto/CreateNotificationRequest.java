package com.healio.notificationservice.dto;

import com.healio.notificationservice.enums.NotificationRole;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CreateNotificationRequest {

    @NotBlank(message = "userId is required")
    private String userId;

    @NotNull(message = "role is required")
    private NotificationRole role;

    @NotBlank(message = "type is required")
    private String type;

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "message is required")
    private String message;

    @NotBlank(message = "referenceId is required")
    private String referenceId;

    private String sourceService;

    private String actionUrl;

    private LocalDateTime scheduledFor;
}
