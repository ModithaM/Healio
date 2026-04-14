package com.healio.doctorservice.controller;

import com.healio.doctorservice.dto.*;
import com.healio.doctorservice.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/doctor-service/")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // doctor profile endpoints
    @PostMapping("/create")
    public ResponseEntity<DoctorProfileResponseDto> createDoctorProfile(
            @Valid @RequestBody DoctorProfileCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(doctorService.createDoctorProfile(request));
    }

    @GetMapping("/getDoctorById/{id}")
    public ResponseEntity<DoctorProfileResponseDto> getDoctorProfileById(@PathVariable String id) {
        return ResponseEntity.ok(doctorService.getDoctorProfileById(id));
    }

    @GetMapping("/getDoctorByUserId/{userId}")
    public ResponseEntity<DoctorProfileResponseDto> getDoctorProfileByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(doctorService.getDoctorProfileByUserId(userId));
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<DoctorProfileResponseDto> updateDoctorProfile(
            @PathVariable String userId,
            @Valid @RequestBody DoctorProfileUpdateRequest request) {
        return ResponseEntity.ok(doctorService.updateDoctorProfile(userId, request));
    }

    @DeleteMapping("/deleteDoctorById/{userId}")
    public ResponseEntity<Void> deleteDoctorProfile(@PathVariable String userId) {
        doctorService.deleteDoctorProfile(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<DoctorProfileResponseDto>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/getBySpecialization/{specialization}")
    public ResponseEntity<List<DoctorProfileResponseDto>> getDoctorsBySpecialization(
            @PathVariable String specialization) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
    }

    //admin Verification Endpoints
    @GetMapping("/getByStatus/{status}")
    public ResponseEntity<List<DoctorProfileResponseDto>> getDoctorsByVerificationStatus(
            @PathVariable String status) {
        return ResponseEntity.ok(doctorService.getDoctorsByVerificationStatus(status));
    }

    @PutMapping("/verify/{doctorId}")
    public ResponseEntity<DoctorProfileResponseDto> updateVerificationStatus(
            @PathVariable String doctorId,
            @RequestParam String status) {
        return ResponseEntity.ok(doctorService.updateVerificationStatus(doctorId, status));
    }

    //Availability Endpoints
    @PostMapping("/availability/add/{userId}")
    public ResponseEntity<DoctorAvailabilityResponseDto> addAvailability(
            @PathVariable String userId,
            @Valid @RequestBody DoctorAvailabilityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(doctorService.addAvailability(userId, request));
    }

    @GetMapping("/availability/get/{userId}")
    public ResponseEntity<List<DoctorAvailabilityResponseDto>> getAvailability(
            @PathVariable String userId) {
        return ResponseEntity.ok(doctorService.getAvailabilityByUserId(userId));
    }

    @PutMapping("/availability/update/{userId}/{availabilityId}")
    public ResponseEntity<DoctorAvailabilityResponseDto> updateAvailability(
            @PathVariable String userId,
            @PathVariable String availabilityId,
            @Valid @RequestBody DoctorAvailabilityRequest request) {
        return ResponseEntity.ok(doctorService.updateAvailability(userId, availabilityId, request));
    }

    @DeleteMapping("/availability/delete/{userId}/{availabilityId}")
    public ResponseEntity<Void> deleteAvailability(
            @PathVariable String userId,
            @PathVariable String availabilityId) {
        doctorService.deleteAvailability(userId, availabilityId);
        return ResponseEntity.ok().build();
    }
}
