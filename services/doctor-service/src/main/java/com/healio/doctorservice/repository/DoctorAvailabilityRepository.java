package com.healio.doctorservice.repository;

import com.healio.doctorservice.model.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, String> {

    List<DoctorAvailability> findAllByDoctorId(String doctorId);

    Optional<DoctorAvailability> findByIdAndDoctorId(String id, String doctorId);

    List<DoctorAvailability> findAllByDoctorIdAndDayOfWeek(String doctorId, DayOfWeek dayOfWeek);

    void deleteAllByDoctorId(String doctorId);
}
