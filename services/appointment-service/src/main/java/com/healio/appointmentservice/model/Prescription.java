package com.healio.appointmentservice.model;

import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity(name = "prescriptions")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Prescription extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String diagnosis;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private LocalDate issuedDate;

    @OneToMany(mappedBy = "prescription", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PrescriptionItem> items;
}
