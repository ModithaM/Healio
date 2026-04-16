package com.healio.appointmentservice.dto;

import com.healio.appointmentservice.enums.AppointmentStatus;
import com.healio.appointmentservice.enums.PaymentStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppointmentResponseDto {
    private String id;
    private String patientId;
    private String doctorId;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private AppointmentStatus status;
    private String reason;
    private String cancelReason;
    private BigDecimal consultationFee;
    private String currency;
    private PaymentStatus paymentStatus;
    private String paypalOrderId;
    private String paypalCaptureId;
    private LocalDateTime paymentTimestamp;
    private PatientProfileResponseDto patient;
    private DoctorProfileResponseDto doctor;
    private PrescriptionResponseDto prescription;
    private LocalDateTime creationTimestamp;
    private LocalDateTime updateTimestamp;
}
