package com.healio.notificationservice.dto;

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
public class SessionNotificationRequest {

    @NotBlank(message = "userId is required")
    private String userId;

    private String phoneNumber;

    @NotBlank(message = "sessionTitle is required")
    private String sessionTitle;

    private String referenceId;

    private String sourceService;

    private String actionUrl;

    @NotNull(message = "scheduledTime is required")
    private LocalDateTime scheduledTime;
}
