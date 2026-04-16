package com.healio.appointmentservice.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppointmentCreateRequest {
    @NotBlank(message = "patientId cannot be blank")
    private String patientId;

    @NotBlank(message = "doctorId cannot be blank")
    private String doctorId;

    @NotNull(message = "appointmentDate cannot be null")
    @FutureOrPresent(message = "appointmentDate must be today or later")
    private LocalDate appointmentDate;

    @NotNull(message = "appointmentTime cannot be null")
    private LocalTime appointmentTime;

    private String reason;

    @DecimalMin(value = "0.01", message = "consultationFee must be greater than zero")
    private BigDecimal consultationFee;

    private String currency;
}
