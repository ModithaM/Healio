package com.healio.patientservice.repository;

import com.healio.patientservice.model.MedicalDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, Long> {
}
