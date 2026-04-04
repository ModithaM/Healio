package com.healio.doctorservice.model;

import com.healio.doctorservice.enums.VerificationStatus;
import lombok.*;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity(name = "doctor_profiles")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DoctorProfile extends BaseEntity {

    @Column(unique = true, nullable = false, updatable = false)
    private String userId;

    @Column(nullable = false)
    private String specialization;

    @Column(unique = true, nullable = false, updatable = false)
    private String licenseNumber;

    @Column(columnDefinition = "TEXT")
    private String qualifications;

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal consultationFee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus verificationStatus;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<DoctorAvailability> availabilitySlots;
}
