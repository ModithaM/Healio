package com.healio.telemedicineservice.dto;

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

    private String userId;
    private String role;
    private String type;
    private String title;
    private String message;
    private String referenceId;
    private String sourceService;
    private String actionUrl;
    private LocalDateTime scheduledFor;
}
