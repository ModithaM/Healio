package com.healio.appointmentservice.model;

import lombok.*;

import javax.persistence.*;

@Entity(name = "prescription_items")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PrescriptionItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescription_id", nullable = false)
    private Prescription prescription;

    @Column(nullable = false)
    private String medicineName;

    @Column(nullable = false)
    private String dosage;

    @Column(nullable = false)
    private String frequency;

    @Column(nullable = true)
    private String duration;

    @Column(columnDefinition = "TEXT")
    private String instructions;
}
