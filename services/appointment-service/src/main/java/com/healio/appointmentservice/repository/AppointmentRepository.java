package com.healio.appointmentservice.repository;

import com.healio.appointmentservice.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {
}
