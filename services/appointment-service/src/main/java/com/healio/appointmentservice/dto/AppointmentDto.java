package com.healio.appointmentservice.dto;

import com.healio.appointmentservice.enums.AppointmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentDto {
    private String id;
    private String patientId;
    private String doctorId;
    private LocalDateTime appointmentDateTime;
    private String reason;
    private AppointmentStatus status;
    private LocalDateTime creationTimestamp;
    private LocalDateTime updateTimestamp;
}
