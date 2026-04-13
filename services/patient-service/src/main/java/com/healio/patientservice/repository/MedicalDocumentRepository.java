package com.healio.patientservice.repository;

import com.healio.patientservice.model.MedicalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, String> {

    List<MedicalDocument> findAllByPatientId(String patientId);

    Optional<MedicalDocument> findByIdAndPatientId(String id, String patientId);

    void deleteAllByPatientId(String patientId);
}
