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
public class SessionNotificationRequest {

    private String userId;
    private String phoneNumber;
    private String sessionTitle;
    private String referenceId;
    private String sourceService;
    private String actionUrl;
    private LocalDateTime scheduledTime;
}
