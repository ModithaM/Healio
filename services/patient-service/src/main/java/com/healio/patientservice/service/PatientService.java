package com.healio.patientservice.service;

import com.healio.patientservice.client.UserServiceClient;
import com.healio.patientservice.dto.MedicalDocumentResponseDto;
import com.healio.patientservice.dto.PatientProfileCreateRequest;
import com.healio.patientservice.dto.PatientProfileResponseDto;
import com.healio.patientservice.dto.PatientProfileUpdateRequest;
import com.healio.patientservice.dto.UserDto;
import com.healio.patientservice.exc.NotFoundException;
import com.healio.patientservice.exc.UnauthorizedException;
import com.healio.patientservice.model.MedicalDocument;
import com.healio.patientservice.model.PatientProfile;
import com.healio.patientservice.repository.MedicalDocumentRepository;
import com.healio.patientservice.repository.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class PatientService {

    private final PatientProfileRepository patientRepository;
    private final MedicalDocumentRepository medicalDocumentRepository;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    public PatientProfileResponseDto createPatientProfile(PatientProfileCreateRequest request) {
        if (patientRepository.existsByUserId(request.getUserId())) {
            throw new NotFoundException("Patient profile already exists for userId: " + request.getUserId());
        }

        PatientProfile patient = modelMapper.map(request, PatientProfile.class);
        PatientProfile savedPatient = patientRepository.save(patient);

        return enrichPatientResponse(savedPatient);
    }

    public PatientProfileResponseDto getPatientProfileByUserId(String userId) {
        PatientProfile patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient profile not found for userId: " + userId));

        return enrichPatientResponse(patient);
    }

    public PatientProfileResponseDto getPatientProfileById(String id) {
        PatientProfile patient = patientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Patient profile not found with id: " + id));

        return enrichPatientResponse(patient);
    }

    public PatientProfileResponseDto updatePatientProfile(String userId, PatientProfileUpdateRequest request) {
        PatientProfile patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient profile not found for userId: " + userId));

        modelMapper.map(request, patient);
        PatientProfile updatedPatient = patientRepository.save(patient);

        return enrichPatientResponse(updatedPatient);
    }

    public void deletePatientProfile(String userId) {
        PatientProfile patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient profile not found for userId: " + userId));

        patientRepository.delete(patient);
    }

    public MedicalDocumentResponseDto uploadMedicalDocument(String userId, String fileName, String fileUrl) {
        PatientProfile patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient profile not found for userId: " + userId));

        MedicalDocument document = MedicalDocument.builder()
                .patient(patient)
                .fileName(fileName)
                .fileUrl(fileUrl)
                .build();

        MedicalDocument savedDocument = medicalDocumentRepository.save(document);

        MedicalDocumentResponseDto dto = modelMapper.map(savedDocument, MedicalDocumentResponseDto.class);
        dto.setUploadedAt(savedDocument.getCreationTimestamp());
        return dto;
    }

    public void deleteMedicalDocument(String userId, String documentId) {
        PatientProfile patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient profile not found for userId: " + userId));

        MedicalDocument document = medicalDocumentRepository.findByIdAndPatientId(documentId, patient.getId())
                .orElseThrow(() -> new NotFoundException("Medical document not found with id: " + documentId));

        if (!document.getPatient().getId().equals(patient.getId())) {
            throw new UnauthorizedException("Document does not belong to this patient");
        }

        medicalDocumentRepository.delete(document);
    }

    public List<PatientProfileResponseDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::enrichPatientResponse)
                .collect(Collectors.toList());
    }

    private PatientProfileResponseDto enrichPatientResponse(PatientProfile patient) {
        PatientProfileResponseDto dto = modelMapper.map(patient, PatientProfileResponseDto.class);

        if (patient.getMedicalDocuments() != null) {
            List<MedicalDocumentResponseDto> documents = patient.getMedicalDocuments().stream()
                    .map(doc -> {
                        MedicalDocumentResponseDto docDto = modelMapper.map(doc, MedicalDocumentResponseDto.class);
                        docDto.setUploadedAt(doc.getCreationTimestamp());
                        return docDto;
                    })
                    .collect(Collectors.toList());
            dto.setMedicalDocuments(documents);
        }

        UserDto userInfo = fetchUserInfo(patient.getUserId());
        dto.setUserInfo(userInfo);

        return dto;
    }

    private UserDto fetchUserInfo(String userId) {
        try {
            ResponseEntity<UserDto> response = userServiceClient.getUserById(userId);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                log.warn("Failed to fetch user info for userId: {}, status: {}", userId, response.getStatusCode());
                return null;
            }
        } catch (Exception e) {
            log.warn("Error fetching user info from UserServiceClient for userId: {}", userId, e);
            return null;
        }
    }
}
