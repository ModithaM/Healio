package com.healio.appointmentservice.repository;

import com.healio.appointmentservice.enums.AppointmentStatus;
import com.healio.appointmentservice.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findAllByOrderByAppointmentDateDescAppointmentTimeDesc();

    List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(String patientId);

    List<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(String doctorId);

    List<Appointment> findByStatusOrderByAppointmentDateDescAppointmentTimeDesc(AppointmentStatus status);

    // Pagination support
    Page<Appointment> findAllByOrderByAppointmentDateDescAppointmentTimeDesc(Pageable pageable);

    Page<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(String patientId, Pageable pageable);

    Page<Appointment> findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(String doctorId, Pageable pageable);

    Page<Appointment> findByStatusOrderByAppointmentDateDescAppointmentTimeDesc(AppointmentStatus status, Pageable pageable);

    // For recent appointments filtering
    @Query("SELECT a FROM appointments a WHERE a.patientId = :patientId AND a.appointmentDate >= :fromDate ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findUpcomingAppointmentsByPatientId(@Param("patientId") String patientId, @Param("fromDate") LocalDate fromDate);

    @Query("SELECT a FROM appointments a WHERE a.doctorId = :doctorId AND a.appointmentDate >= :fromDate ORDER BY a.appointmentDate DESC, a.appointmentTime DESC")
    List<Appointment> findUpcomingAppointmentsByDoctorId(@Param("doctorId") String doctorId, @Param("fromDate") LocalDate fromDate);

    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNotIn(
            String doctorId,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            Collection<AppointmentStatus> statuses);
}