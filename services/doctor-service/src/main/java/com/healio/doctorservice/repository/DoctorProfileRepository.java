package com.healio.doctorservice.repository;

import com.healio.doctorservice.enums.VerificationStatus;
import com.healio.doctorservice.model.DoctorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, String> {

    Optional<DoctorProfile> findByUserId(String userId);

    boolean existsByUserId(String userId);

    boolean existsByLicenseNumber(String licenseNumber);

    List<DoctorProfile> findAllBySpecializationIgnoreCase(String specialization);

    List<DoctorProfile> findAllByVerificationStatus(VerificationStatus verificationStatus);
}
