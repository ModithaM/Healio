package com.healio.appointmentservice.service;

import com.healio.appointmentservice.client.DoctorServiceClient;
import com.healio.appointmentservice.client.PatientServiceClient;
import com.healio.appointmentservice.dto.*;
import com.healio.appointmentservice.enums.AppointmentStatus;
import com.healio.appointmentservice.exc.NotFoundException;
import com.healio.appointmentservice.model.Appointment;
import com.healio.appointmentservice.model.Prescription;
import com.healio.appointmentservice.model.PrescriptionItem;
import com.healio.appointmentservice.repository.AppointmentRepository;
import com.healio.appointmentservice.repository.PrescriptionRepository;
import com.healio.appointmentservice.request.AppointmentCreateRequest;
import com.healio.appointmentservice.request.AppointmentStatusUpdateRequest;
import com.healio.appointmentservice.request.AppointmentUpdateRequest;
import com.healio.appointmentservice.request.PrescriptionCreateRequest;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentService {

    private static final Set<AppointmentStatus> BLOCKING_STATUSES = Set.of(
            AppointmentStatus.CANCELLED,
            AppointmentStatus.COMPLETED,
            AppointmentStatus.NO_SHOW
    );

    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientServiceClient patientServiceClient;
    private final DoctorServiceClient doctorServiceClient;
    private final ModelMapper modelMapper;

    public AppointmentResponseDto createAppointment(AppointmentCreateRequest request) {
        ensurePatientExists(request.getPatientId());
        ensureDoctorExists(request.getDoctorId());
        ensureNoScheduleConflict(request.getDoctorId(), request.getAppointmentDate(), request.getAppointmentTime(), null);

        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .status(AppointmentStatus.PENDING)
                .reason(request.getReason())
                .build();

        return toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponseDto getAppointmentById(String id) {
        return toResponse(findAppointmentById(id));
    }

    public List<AppointmentResponseDto> getAllAppointments() {
        return appointmentRepository.findAllByOrderByAppointmentDateDescAppointmentTimeDesc().stream()
                .map(this::toResponseLite)
                .collect(Collectors.toList());
    }

    public PaginatedAppointmentResponseDto getAllAppointmentsPaginated(Pageable pageable) {
        Page<Appointment> page = appointmentRepository.findAllByOrderByAppointmentDateDescAppointmentTimeDesc(pageable);
        return toPagedResponse(page);
    }

    public PaginatedAppointmentResponseDto getAppointmentsByPatientIdPaginated(String patientId, Pageable pageable) {
        Page<Appointment> page = appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patientId, pageable);
        return toPagedResponse(page);
    }

    public PaginatedAppointmentResponseDto getAppointmentsByDoctorIdPaginated(String doctorId, Pageable pageable) {
        Page<Appointment> page = appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctorId, pageable);
        return toPagedResponse(page);
    }

    public PaginatedAppointmentResponseDto getAppointmentsByStatusPaginated(AppointmentStatus status, Pageable pageable) {
        Page<Appointment> page = appointmentRepository.findByStatusOrderByAppointmentDateDescAppointmentTimeDesc(status, pageable);
        return toPagedResponse(page);
    }

    public List<AppointmentResponseDto> getAppointmentsByPatientId(String patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patientId).stream()
                .map(this::toResponseLite)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponseDto> getAppointmentsByDoctorId(String doctorId) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescAppointmentTimeDesc(doctorId).stream()
                .map(this::toResponseLite)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponseDto> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatusOrderByAppointmentDateDescAppointmentTimeDesc(status).stream()
                .map(this::toResponseLite)
                .collect(Collectors.toList());
    }

    public AppointmentResponseDto updateAppointment(String id, AppointmentUpdateRequest request) {
        Appointment appointment = findAppointmentById(id);

        LocalDate appointmentDate = request.getAppointmentDate() != null ? request.getAppointmentDate() : appointment.getAppointmentDate();
        LocalTime appointmentTime = request.getAppointmentTime() != null ? request.getAppointmentTime() : appointment.getAppointmentTime();

        if (request.getAppointmentDate() != null || request.getAppointmentTime() != null) {
            ensureNoScheduleConflict(appointment.getDoctorId(), appointmentDate, appointmentTime, appointment.getId());
            appointment.setAppointmentDate(appointmentDate);
            appointment.setAppointmentTime(appointmentTime);
        }

        if (request.getReason() != null) {
            appointment.setReason(request.getReason());
        }

        return toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponseDto updateStatus(String id, AppointmentStatusUpdateRequest request) {
        Appointment appointment = findAppointmentById(id);
        appointment.setStatus(request.getStatus());

        if (request.getStatus() == AppointmentStatus.CANCELLED) {
            appointment.setCancelReason(request.getCancelReason());
        } else {
            appointment.setCancelReason(null);
        }

        return toResponse(appointmentRepository.save(appointment));
    }

    public AppointmentResponseDto cancelAppointment(String id, String cancelReason) {
        return updateStatus(id, AppointmentStatusUpdateRequest.builder()
                .status(AppointmentStatus.CANCELLED)
                .cancelReason(cancelReason)
                .build());
    }

    public AppointmentResponseDto markConfirmed(String id) {
        return updateStatus(id, AppointmentStatusUpdateRequest.builder()
                .status(AppointmentStatus.CONFIRMED)
                .build());
    }

    public AppointmentResponseDto markCompleted(String id) {
        return updateStatus(id, AppointmentStatusUpdateRequest.builder()
                .status(AppointmentStatus.COMPLETED)
                .build());
    }

    public AppointmentResponseDto markNoShow(String id) {
        return updateStatus(id, AppointmentStatusUpdateRequest.builder()
                .status(AppointmentStatus.NO_SHOW)
                .build());
    }

    public void deleteAppointment(String id) {
        Appointment appointment = findAppointmentById(id);
        appointmentRepository.delete(appointment);
    }

    public PrescriptionResponseDto createPrescription(String appointmentId, PrescriptionCreateRequest request) {
        Appointment appointment = findAppointmentById(appointmentId);

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new NotFoundException("Cannot create a prescription for a cancelled appointment");
        }

        Prescription prescription = Prescription.builder()
                .appointment(appointment)
                .doctorId(appointment.getDoctorId())
                .patientId(appointment.getPatientId())
                .diagnosis(request.getDiagnosis())
                .notes(request.getNotes())
                .issuedDate(request.getIssuedDate() != null ? request.getIssuedDate() : LocalDate.now())
                .build();

        List<PrescriptionItem> items = request.getItems().stream()
                .map(itemRequest -> PrescriptionItem.builder()
                        .prescription(prescription)
                        .medicineName(itemRequest.getMedicineName())
                        .dosage(itemRequest.getDosage())
                        .frequency(itemRequest.getFrequency())
                        .duration(itemRequest.getDuration())
                        .instructions(itemRequest.getInstructions())
                        .build())
                .collect(Collectors.toList());

        prescription.setItems(items);
        appointment.setPrescription(prescription);

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return toPrescriptionResponse(savedAppointment.getPrescription());
    }

    public PrescriptionResponseDto getPrescriptionByAppointmentId(String appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new NotFoundException("Prescription not found for appointment id: " + appointmentId));

        return toPrescriptionResponse(prescription);
    }

    public List<PrescriptionResponseDto> getPrescriptionsByPatientId(String patientId) {
        return prescriptionRepository.findByPatientIdOrderByIssuedDateDesc(patientId).stream()
                .map(this::toPrescriptionResponse)
                .collect(Collectors.toList());
    }

    public PaginatedPrescriptionResponseDto getPrescriptionsByPatientIdPaginated(String patientId, Pageable pageable) {
        Page<Prescription> page = prescriptionRepository.findByPatientIdOrderByIssuedDateDesc(patientId, pageable);
        List<PrescriptionResponseDto> content = page.getContent().stream()
                .map(this::toPrescriptionResponse)
                .collect(Collectors.toList());

        return PaginatedPrescriptionResponseDto.builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .build();
    }

    private Appointment findAppointmentById(String id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Appointment not found with id: " + id));
    }

    private void ensurePatientExists(String patientId) {
        try {
            patientServiceClient.getPatientByUserId(patientId);
        } catch (Exception exception) {
            throw new NotFoundException("Patient profile not found for userId: " + patientId);
        }
    }

    private void ensureDoctorExists(String doctorId) {
        try {
            doctorServiceClient.getDoctorByUserId(doctorId);
        } catch (Exception exception) {
            throw new NotFoundException("Doctor profile not found for userId: " + doctorId);
        }
    }

    private void ensureNoScheduleConflict(String doctorId, LocalDate appointmentDate, LocalTime appointmentTime, String currentAppointmentId) {
        boolean conflictExists = appointmentRepository.existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNotIn(
                doctorId,
                appointmentDate,
                appointmentTime,
                BLOCKING_STATUSES);

        if (conflictExists) {
            if (currentAppointmentId == null) {
                throw new NotFoundException("Doctor already has an appointment at the selected date and time");
            }

            boolean sameSlot = appointmentRepository.findById(currentAppointmentId)
                    .map(appointment -> appointment.getDoctorId().equals(doctorId)
                            && appointment.getAppointmentDate().equals(appointmentDate)
                            && appointment.getAppointmentTime().equals(appointmentTime))
                    .orElse(false);

            if (!sameSlot) {
                throw new NotFoundException("Doctor already has an appointment at the selected date and time");
            }
        }
    }

    private AppointmentResponseDto toResponse(Appointment appointment) {
        AppointmentResponseDto response = modelMapper.map(appointment, AppointmentResponseDto.class);
        response.setPatient(fetchPatientProfile(appointment.getPatientId()));
        response.setDoctor(fetchDoctorProfile(appointment.getDoctorId()));

        if (appointment.getPrescription() != null) {
            response.setPrescription(toPrescriptionResponse(appointment.getPrescription()));
        } else {
            prescriptionRepository.findByAppointmentId(appointment.getId())
                    .ifPresent(prescription -> response.setPrescription(toPrescriptionResponse(prescription)));
        }

        return response;
    }

    private AppointmentResponseDto toResponseLite(Appointment appointment) {
        AppointmentResponseDto response = modelMapper.map(appointment, AppointmentResponseDto.class);
        // Don't fetch patient/doctor profiles here to avoid N+1 queries
        // Set null to indicate they need to be fetched separately if needed
        return response;
    }

    private PaginatedAppointmentResponseDto toPagedResponse(Page<Appointment> page) {
        List<AppointmentResponseDto> content = page.getContent().stream()
                .map(this::toResponseLite)
                .collect(Collectors.toList());

        return PaginatedAppointmentResponseDto.builder()
                .content(content)
                .pageNumber(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .build();
    }

    public List<AppointmentResponseDto> enrichAppointmentsWithProfilesAndPrescriptions(List<AppointmentResponseDto> appointments) {
        if (appointments == null || appointments.isEmpty()) {
            return appointments;
        }

        // Extract unique patient and doctor IDs
        Set<String> patientIds = new HashSet<>();
        Set<String> doctorIds = new HashSet<>();
        
        for (AppointmentResponseDto appt : appointments) {
            patientIds.add(appt.getPatientId());
            doctorIds.add(appt.getDoctorId());
        }

        // Batch fetch patient and doctor profiles
        Map<String, PatientProfileResponseDto> patientMap = batchFetchPatientProfiles(new ArrayList<>(patientIds));
        Map<String, DoctorProfileResponseDto> doctorMap = batchFetchDoctorProfiles(new ArrayList<>(doctorIds));

        // Enrich appointments with fetched profiles and prescriptions
        for (AppointmentResponseDto appt : appointments) {
            appt.setPatient(patientMap.get(appt.getPatientId()));
            appt.setDoctor(doctorMap.get(appt.getDoctorId()));
            
            // Fetch prescription if appointment has one
            prescriptionRepository.findByAppointmentId(appt.getId())
                    .ifPresent(prescription -> appt.setPrescription(toPrescriptionResponse(prescription)));
        }

        return appointments;
    }

    private Map<String, PatientProfileResponseDto> batchFetchPatientProfiles(List<String> patientIds) {
        Map<String, PatientProfileResponseDto> result = new HashMap<>();
        if (patientIds == null || patientIds.isEmpty()) {
            return result;
        }

        for (String patientId : patientIds) {
            try {
                PatientProfileResponseDto patient = patientServiceClient.getPatientByUserId(patientId).getBody();
                if (patient != null) {
                    result.put(patientId, patient);
                }
            } catch (Exception e) {
                // Log error but continue processing other patients
            }
        }
        return result;
    }

    private Map<String, DoctorProfileResponseDto> batchFetchDoctorProfiles(List<String> doctorIds) {
        Map<String, DoctorProfileResponseDto> result = new HashMap<>();
        if (doctorIds == null || doctorIds.isEmpty()) {
            return result;
        }

        for (String doctorId : doctorIds) {
            try {
                DoctorProfileResponseDto doctor = doctorServiceClient.getDoctorByUserId(doctorId).getBody();
                if (doctor != null) {
                    result.put(doctorId, doctor);
                }
            } catch (Exception e) {
                // Log error but continue processing other doctors
            }
        }
        return result;
    }

    private PrescriptionResponseDto toPrescriptionResponse(Prescription prescription) {
        PrescriptionResponseDto response = modelMapper.map(prescription, PrescriptionResponseDto.class);
        if (prescription.getAppointment() != null) {
            response.setAppointmentId(prescription.getAppointment().getId());
        }
        if (prescription.getItems() != null) {
            response.setItems(prescription.getItems().stream()
                    .map(item -> modelMapper.map(item, PrescriptionItemResponseDto.class))
                    .collect(Collectors.toList()));
        }
        return response;
    }

    private PatientProfileResponseDto fetchPatientProfile(String patientId) {
        try {
            return patientServiceClient.getPatientByUserId(patientId).getBody();
        } catch (Exception exception) {
            return null;
        }
    }

    private DoctorProfileResponseDto fetchDoctorProfile(String doctorId) {
        try {
            return doctorServiceClient.getDoctorByUserId(doctorId).getBody();
        } catch (Exception exception) {
            return null;
        }
    }
}