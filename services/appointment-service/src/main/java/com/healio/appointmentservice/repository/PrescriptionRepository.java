package com.healio.appointmentservice.repository;

import com.healio.appointmentservice.model.Prescription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PrescriptionRepository extends JpaRepository<Prescription, String> {
    Optional<Prescription> findByAppointmentId(String appointmentId);

    List<Prescription> findByPatientIdOrderByIssuedDateDesc(String patientId);

    Page<Prescription> findByPatientIdOrderByIssuedDateDesc(String patientId, Pageable pageable);
}