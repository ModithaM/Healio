package com.healio.symptomcheckerservice.repository;

import com.healio.symptomcheckerservice.entity.SymptomCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SymptomCheckRepository extends JpaRepository<SymptomCheck, String> {

    List<SymptomCheck> findByUserIdOrderByCreatedAtDesc(String userId);
}
