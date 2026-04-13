package com.healio.telemedicineservice.dto;

import com.healio.telemedicineservice.enums.SessionStatus;
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
public class JoinDetailsResponse {

    private String sessionId;
    private String agoraAppId;
    private String agoraChannelName;
    private String agoraToken;
    private SessionStatus status;
    private String doctorId;
    private String patientId;
}
