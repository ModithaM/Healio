package com.healio.appointmentservice.service;

import com.healio.appointmentservice.dto.AppointmentDto;
import com.healio.appointmentservice.enums.AppointmentStatus;
import com.healio.appointmentservice.model.Appointment;
import com.healio.appointmentservice.repository.AppointmentRepository;
import com.healio.appointmentservice.request.AppointmentCreateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentDto createAppointment(AppointmentCreateRequest request) {
        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentDateTime(request.getAppointmentDateTime())
                .reason(request.getReason())
                .status(AppointmentStatus.SCHEDULED)
                .build();

        return toDto(appointmentRepository.save(appointment));
    }

    public List<AppointmentDto> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    private AppointmentDto toDto(Appointment appointment) {
        return AppointmentDto.builder()
                .id(appointment.getId())
                .patientId(appointment.getPatientId())
                .doctorId(appointment.getDoctorId())
                .appointmentDateTime(appointment.getAppointmentDateTime())
                .reason(appointment.getReason())
                .status(appointment.getStatus())
                .creationTimestamp(appointment.getCreationTimestamp())
                .updateTimestamp(appointment.getUpdateTimestamp())
                .build();
    }
}
