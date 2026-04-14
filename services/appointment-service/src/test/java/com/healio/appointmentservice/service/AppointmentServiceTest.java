package com.healio.appointmentservice.service;

import com.healio.appointmentservice.client.DoctorServiceClient;
import com.healio.appointmentservice.client.PatientServiceClient;
import com.healio.appointmentservice.dto.AppointmentResponseDto;
import com.healio.appointmentservice.dto.PrescriptionResponseDto;
import com.healio.appointmentservice.dto.UserDto;
import com.healio.appointmentservice.enums.AppointmentStatus;
import com.healio.appointmentservice.model.Appointment;
import com.healio.appointmentservice.model.Prescription;
import com.healio.appointmentservice.model.PrescriptionItem;
import com.healio.appointmentservice.repository.AppointmentRepository;
import com.healio.appointmentservice.repository.PrescriptionRepository;
import com.healio.appointmentservice.request.AppointmentCreateRequest;
import com.healio.appointmentservice.request.AppointmentStatusUpdateRequest;
import com.healio.appointmentservice.request.AppointmentUpdateRequest;
import com.healio.appointmentservice.request.PrescriptionCreateRequest;
import com.healio.appointmentservice.request.PrescriptionItemRequest;
import org.junit.jupiter.api.Test;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AppointmentServiceTest {

    private final AppointmentRepository appointmentRepository = mock(AppointmentRepository.class);
    private final PrescriptionRepository prescriptionRepository = mock(PrescriptionRepository.class);
    private final PatientServiceClient patientServiceClient = mock(PatientServiceClient.class);
    private final DoctorServiceClient doctorServiceClient = mock(DoctorServiceClient.class);
    private final ModelMapper modelMapper = new ModelMapper();
    private final AppointmentService appointmentService = new AppointmentService(
            appointmentRepository,
            prescriptionRepository,
            patientServiceClient,
            doctorServiceClient,
            modelMapper);

    @Test
    void shouldCreateAppointmentAndEnrichResponse() {
        when(patientServiceClient.getPatientByUserId("patient-1"))
                .thenReturn(ResponseEntity.ok(new com.healio.appointmentservice.dto.PatientProfileResponseDto()));
        when(doctorServiceClient.getDoctorByUserId("doctor-1"))
                .thenReturn(ResponseEntity.ok(new com.healio.appointmentservice.dto.DoctorProfileResponseDto()));
        when(appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNotIn(
                eq("doctor-1"), eq(LocalDate.now()), eq(LocalTime.of(10, 30)), any()))
                .thenReturn(false);
        when(appointmentRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AppointmentResponseDto response = appointmentService.createAppointment(AppointmentCreateRequest.builder()
                .patientId("patient-1")
                .doctorId("doctor-1")
                .appointmentDate(LocalDate.now())
                .appointmentTime(LocalTime.of(10, 30))
                .reason("Follow up")
                .build());

        assertNotNull(response);
        assertEquals("patient-1", response.getPatientId());
        assertEquals("doctor-1", response.getDoctorId());
        assertEquals(AppointmentStatus.PENDING, response.getStatus());
    }

    @Test
    void shouldUpdateStatusAndClearCancelReasonForNonCancelledStatuses() {
        Appointment appointment = Appointment.builder()
                .patientId("patient-1")
                .doctorId("doctor-1")
                .appointmentDate(LocalDate.now())
                .appointmentTime(LocalTime.of(10, 30))
                .status(AppointmentStatus.PENDING)
                .cancelReason("old reason")
                .build();

        when(appointmentRepository.findById("appt-1")).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(patientServiceClient.getPatientByUserId("patient-1"))
                .thenReturn(ResponseEntity.ok(new com.healio.appointmentservice.dto.PatientProfileResponseDto()));
        when(doctorServiceClient.getDoctorByUserId("doctor-1"))
                .thenReturn(ResponseEntity.ok(new com.healio.appointmentservice.dto.DoctorProfileResponseDto()));

        AppointmentResponseDto response = appointmentService.updateStatus("appt-1",
                AppointmentStatusUpdateRequest.builder().status(AppointmentStatus.CONFIRMED).build());

        assertEquals(AppointmentStatus.CONFIRMED, response.getStatus());
        assertEquals(null, appointment.getCancelReason());
    }

    @Test
    void shouldCreatePrescriptionForAppointment() {
        Appointment appointment = Appointment.builder()
                .patientId("patient-1")
                .doctorId("doctor-1")
                .appointmentDate(LocalDate.now())
                .appointmentTime(LocalTime.of(10, 30))
                .status(AppointmentStatus.CONFIRMED)
                .build();
        ReflectionTestUtils.setField(appointment, "id", "appt-1");

        when(appointmentRepository.findById("appt-1")).thenReturn(Optional.of(appointment));
        when(appointmentRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        PrescriptionCreateRequest request = PrescriptionCreateRequest.builder()
                .diagnosis("Flu")
                .items(List.of(PrescriptionItemRequest.builder()
                        .medicineName("Paracetamol")
                        .dosage("500mg")
                        .frequency("Twice a day")
                        .build()))
                .build();

        PrescriptionResponseDto response = appointmentService.createPrescription("appt-1", request);

        assertNotNull(response);
        assertEquals("appt-1", response.getAppointmentId());
        assertEquals(1, response.getItems().size());
        verify(appointmentRepository).save(any(Appointment.class));
        verify(patientServiceClient, never()).getPatientByUserId("patient-1");
    }
}