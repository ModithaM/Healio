package com.healio.appointmentservice.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppointmentUpdateRequest {
    @FutureOrPresent(message = "appointmentDate must be today or later")
    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String reason;
}