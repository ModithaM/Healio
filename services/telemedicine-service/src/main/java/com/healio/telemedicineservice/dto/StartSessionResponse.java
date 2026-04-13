package com.healio.telemedicineservice.dto;

import com.healio.telemedicineservice.enums.SessionStatus;
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
public class StartSessionResponse {

    private String sessionId;
    private String agoraAppId;
    private String agoraChannelName;
    private String agoraToken;
    private SessionStatus status;
    private LocalDateTime actualStartTime;
}
