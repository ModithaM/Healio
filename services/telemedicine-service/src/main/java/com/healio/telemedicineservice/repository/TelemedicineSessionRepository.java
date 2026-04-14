package com.healio.telemedicineservice.repository;

import com.healio.telemedicineservice.entity.TelemedicineSession;
import com.healio.telemedicineservice.enums.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface TelemedicineSessionRepository extends JpaRepository<TelemedicineSession, String>,
        JpaSpecificationExecutor<TelemedicineSession> {

    Optional<TelemedicineSession> findByAgoraChannelName(String agoraChannelName);

    boolean existsByAgoraChannelName(String agoraChannelName);

    boolean existsByAppointmentId(String appointmentId);

    long countByDoctorIdAndStatus(String doctorId, SessionStatus status);
}
