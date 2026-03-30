package com.healio.appointmentservice.request;

import lombok.Data;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
public class AppointmentCreateRequest {

    @NotBlank(message = "patientId is required")
    private String patientId;

    @NotBlank(message = "doctorId is required")
    private String doctorId;

    @NotNull(message = "appointmentDateTime is required")
    @Future(message = "appointmentDateTime must be in the future")
    private LocalDateTime appointmentDateTime;

    @Size(max = 500, message = "reason cannot exceed 500 characters")
    private String reason;
}
