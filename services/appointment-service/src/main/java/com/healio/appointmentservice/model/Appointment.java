package com.healio.appointmentservice.model;

import com.healio.appointmentservice.enums.AppointmentStatus;
import com.healio.appointmentservice.enums.PaymentStatus;
import lombok.*;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity(name = "appointments")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Appointment extends BaseEntity {

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String cancelReason;

    @Column(precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Column(length = 10)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column
    private PaymentStatus paymentStatus;

    @Column(length = 64)
    private String paypalOrderId;

    @Column(length = 64)
    private String paypalCaptureId;

    private LocalDateTime paymentTimestamp;

    @OneToOne(mappedBy = "appointment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Prescription prescription;
}
