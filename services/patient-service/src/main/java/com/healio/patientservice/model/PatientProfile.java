package com.healio.patientservice.model;

import com.healio.patientservice.enums.BloodGroup;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity(name = "patient_profiles")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PatientProfile extends BaseEntity {

    @Column(unique = true, nullable = false, updatable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private BloodGroup bloodGroup;

    @Column(nullable = true)
    private LocalDate dateOfBirth;

    @Column(nullable = true)
    private String emergencyContactName;

    @Column(nullable = true)
    private String emergencyContactPhone;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<MedicalDocument> medicalDocuments;
}
