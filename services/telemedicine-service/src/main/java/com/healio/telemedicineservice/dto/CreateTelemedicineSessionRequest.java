package com.healio.telemedicineservice.dto;

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
public class CreateTelemedicineSessionRequest {

    @NotBlank(message = "appointmentId is required")
    private String appointmentId;

    @NotBlank(message = "patientId is required")
    private String patientId;

    @NotBlank(message = "doctorId is required")
    private String doctorId;

    @NotBlank(message = "sessionTitle is required")
    private String sessionTitle;

    private String description;

    @NotNull(message = "scheduledStartTime is required")
    private LocalDateTime scheduledStartTime;

    @NotNull(message = "scheduledEndTime is required")
    private LocalDateTime scheduledEndTime;
}
