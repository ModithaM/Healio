package com.healio.patientservice.controller;

import com.healio.patientservice.dto.MedicalDocumentResponseDto;
import com.healio.patientservice.dto.PatientProfileCreateRequest;
import com.healio.patientservice.dto.PatientProfileResponseDto;
import com.healio.patientservice.dto.PatientProfileUpdateRequest;
import com.healio.patientservice.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/v1/patient-service/")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @PostMapping("/create")
    public ResponseEntity<PatientProfileResponseDto> createPatientProfile(
            @Valid @RequestBody PatientProfileCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.createPatientProfile(request));
    }

    @GetMapping("/getPatientById/{id}")
    public ResponseEntity<PatientProfileResponseDto> getPatientProfileById(@PathVariable String id) {
        return ResponseEntity.ok(patientService.getPatientProfileById(id));
    }

    @GetMapping("/getPatientByUserId/{userId}")
    public ResponseEntity<PatientProfileResponseDto> getPatientProfileByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(patientService.getPatientProfileByUserId(userId));
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<PatientProfileResponseDto> updatePatientProfile(
            @PathVariable String userId,
            @Valid @RequestBody PatientProfileUpdateRequest request) {
        return ResponseEntity.ok(patientService.updatePatientProfile(userId, request));
    }

    @DeleteMapping("/deletePatientById/{userId}")
    public ResponseEntity<Void> deletePatientProfile(@PathVariable String userId) {
        patientService.deletePatientProfile(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<PatientProfileResponseDto>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @PostMapping("/uploadDocument/{userId}")
    public ResponseEntity<MedicalDocumentResponseDto> uploadMedicalDocument(
            @PathVariable String userId,
            @RequestParam String fileName,
            @RequestParam String fileUrl) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(patientService.uploadMedicalDocument(userId, fileName, fileUrl));
    }

    @GetMapping("/getDocuments/{userId}")
    public ResponseEntity<PatientProfileResponseDto> getPatientDocuments(@PathVariable String userId) {
        return ResponseEntity.ok(patientService.getPatientProfileByUserId(userId));
    }

    @DeleteMapping("/deleteDocument/{userId}/{documentId}")
    public ResponseEntity<Void> deleteMedicalDocument(
            @PathVariable String userId,
            @PathVariable String documentId) {
        patientService.deleteMedicalDocument(userId, documentId);
        return ResponseEntity.ok().build();
    }
}
