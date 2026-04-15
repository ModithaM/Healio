package com.healio.appointmentservice.controller;

import com.healio.appointmentservice.dto.*;
import com.healio.appointmentservice.enums.AppointmentStatus;
import com.healio.appointmentservice.request.AppointmentCreateRequest;
import com.healio.appointmentservice.request.AppointmentStatusUpdateRequest;
import com.healio.appointmentservice.request.AppointmentUpdateRequest;
import com.healio.appointmentservice.request.PrescriptionCreateRequest;
import com.healio.appointmentservice.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/v1/appointment-service")
@RequiredArgsConstructor
public class AppointmentController {
        private final AppointmentService appointmentService;

        @PostMapping("/appointments")
        public ResponseEntity<AppointmentResponseDto> createAppointment(@Valid @RequestBody AppointmentCreateRequest request) {
                return ResponseEntity.ok(appointmentService.createAppointment(request));
        }

        @GetMapping("/appointments")
        public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments() {
                return ResponseEntity.ok(appointmentService.getAllAppointments());
        }

        @GetMapping("/appointments/paginated")
        public ResponseEntity<PaginatedAppointmentResponseDto> getAllAppointmentsPaginated(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending().and(Sort.by("appointmentTime").descending()));
                return ResponseEntity.ok(appointmentService.getAllAppointmentsPaginated(pageable));
        }

        @GetMapping("/appointments/{id}")
        public ResponseEntity<AppointmentResponseDto> getAppointmentById(@PathVariable String id) {
                return ResponseEntity.ok(appointmentService.getAppointmentById(id));
        }

        @GetMapping("/appointments/patient/{patientId}")
        public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByPatientId(@PathVariable String patientId) {
                return ResponseEntity.ok(appointmentService.getAppointmentsByPatientId(patientId));
        }

        @GetMapping("/appointments/patient/{patientId}/paginated")
        public ResponseEntity<PaginatedAppointmentResponseDto> getAppointmentsByPatientIdPaginated(
                @PathVariable String patientId,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending().and(Sort.by("appointmentTime").descending()));
                return ResponseEntity.ok(appointmentService.getAppointmentsByPatientIdPaginated(patientId, pageable));
        }

        @GetMapping("/appointments/doctor/{doctorId}")
        public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByDoctorId(@PathVariable String doctorId) {
                return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorId(doctorId));
        }

        @GetMapping("/appointments/doctor/{doctorId}/paginated")
        public ResponseEntity<PaginatedAppointmentResponseDto> getAppointmentsByDoctorIdPaginated(
                @PathVariable String doctorId,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending().and(Sort.by("appointmentTime").descending()));
                return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorIdPaginated(doctorId, pageable));
        }

        @GetMapping("/appointments/status/{status}")
        public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByStatus(@PathVariable AppointmentStatus status) {
                return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
        }

        @GetMapping("/appointments/status/{status}/paginated")
        public ResponseEntity<PaginatedAppointmentResponseDto> getAppointmentsByStatusPaginated(
                @PathVariable AppointmentStatus status,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending().and(Sort.by("appointmentTime").descending()));
                return ResponseEntity.ok(appointmentService.getAppointmentsByStatusPaginated(status, pageable));
        }

        @PutMapping("/appointments/{id}")
        public ResponseEntity<AppointmentResponseDto> updateAppointment(
                        @PathVariable String id,
                        @Valid @RequestBody AppointmentUpdateRequest request) {
                return ResponseEntity.ok(appointmentService.updateAppointment(id, request));
        }

        @PatchMapping("/appointments/{id}/status")
        public ResponseEntity<AppointmentResponseDto> updateStatus(
                        @PathVariable String id,
                        @Valid @RequestBody AppointmentStatusUpdateRequest request) {
                return ResponseEntity.ok(appointmentService.updateStatus(id, request));
        }

        @PatchMapping("/appointments/{id}/confirm")
        public ResponseEntity<AppointmentResponseDto> confirmAppointment(@PathVariable String id) {
                return ResponseEntity.ok(appointmentService.markConfirmed(id));
        }

        @PatchMapping("/appointments/{id}/complete")
        public ResponseEntity<AppointmentResponseDto> completeAppointment(@PathVariable String id) {
                return ResponseEntity.ok(appointmentService.markCompleted(id));
        }

        @PatchMapping("/appointments/{id}/no-show")
        public ResponseEntity<AppointmentResponseDto> markNoShow(@PathVariable String id) {
                return ResponseEntity.ok(appointmentService.markNoShow(id));
        }

        @DeleteMapping("/appointments/{id}")
        public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
                appointmentService.deleteAppointment(id);
                return ResponseEntity.ok().build();
        }

        @PostMapping("/appointments/{id}/cancel")
        public ResponseEntity<AppointmentResponseDto> cancelAppointment(
                        @PathVariable String id,
                        @RequestParam(required = false) String reason) {
                return ResponseEntity.ok(appointmentService.cancelAppointment(id, reason));
        }

        @PostMapping("/appointments/{appointmentId}/prescriptions")
        public ResponseEntity<PrescriptionResponseDto> createPrescription(
                        @PathVariable String appointmentId,
                        @Valid @RequestBody PrescriptionCreateRequest request) {
                return ResponseEntity.ok(appointmentService.createPrescription(appointmentId, request));
        }

        @GetMapping("/appointments/{appointmentId}/prescription")
        public ResponseEntity<PrescriptionResponseDto> getPrescriptionByAppointmentId(@PathVariable String appointmentId) {
                return ResponseEntity.ok(appointmentService.getPrescriptionByAppointmentId(appointmentId));
        }

        @GetMapping("/prescriptions/patient/{patientId}")
        public ResponseEntity<List<PrescriptionResponseDto>> getPrescriptionsByPatientId(@PathVariable String patientId) {
                return ResponseEntity.ok(appointmentService.getPrescriptionsByPatientId(patientId));
        }

        @GetMapping("/prescriptions/patient/{patientId}/paginated")
        public ResponseEntity<PaginatedPrescriptionResponseDto> getPrescriptionsByPatientIdPaginated(
                @PathVariable String patientId,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size) {
                Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
                return ResponseEntity.ok(appointmentService.getPrescriptionsByPatientIdPaginated(patientId, pageable));
        }
}
