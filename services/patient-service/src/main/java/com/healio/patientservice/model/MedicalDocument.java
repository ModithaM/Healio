package com.healio.patientservice.model;

import com.healio.patientservice.enums.FileType;
import lombok.*;

import jakarta.persistence.*;

@Entity(name = "medical_documents")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MedicalDocument extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private PatientProfile patient;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private FileType fileType;

    @Column(columnDefinition = "TEXT")
    private String description;
}
