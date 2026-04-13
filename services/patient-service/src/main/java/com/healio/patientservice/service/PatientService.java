package com.healio.patientservice.service;

import com.healio.patientservice.dto.MedicalDocumentResponseDto;
import com.healio.patientservice.dto.PatientNameResponse;
import com.healio.patientservice.dto.PatientProfileCreateRequest;
import com.healio.patientservice.dto.PatientProfileResponseDto;
import com.healio.patientservice.dto.PatientProfileUpdateRequest;

import java.util.List;

public interface PatientService {

    PatientProfileResponseDto createPatientProfile(PatientProfileCreateRequest request);

    PatientProfileResponseDto getPatientProfileByUserId(String userId);

    PatientProfileResponseDto getPatientProfileById(String id);

    PatientProfileResponseDto updatePatientProfile(String userId, PatientProfileUpdateRequest request);

    void deletePatientProfile(String userId);

    MedicalDocumentResponseDto uploadMedicalDocument(String userId, String fileName, String fileUrl);

    void deleteMedicalDocument(String userId, String documentId);

    List<PatientProfileResponseDto> getAllPatients();

    List<PatientNameResponse> getPatientNames();
}
