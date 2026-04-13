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
public class TelemedicineSessionResponse {

    private String id;
    private String appointmentId;
    private String patientId;
    private String doctorId;
    private String sessionTitle;
    private String description;
    private LocalDateTime scheduledStartTime;
    private LocalDateTime scheduledEndTime;
    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;
    private SessionStatus status;
    private String agoraChannelName;
    private String consultationNotes;
    private String prescriptionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
