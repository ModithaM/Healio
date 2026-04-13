package com.healio.patientservice.repository;

import com.healio.patientservice.enums.BloodGroup;
import com.healio.patientservice.model.PatientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientProfileRepository extends JpaRepository<PatientProfile, String> {

    Optional<PatientProfile> findByUserId(String userId);

    boolean existsByUserId(String userId);

    List<PatientProfile> findAllByBloodGroup(BloodGroup bloodGroup);

    List<PatientProfile> findAllByOrderByCreationTimestampDesc();
}
