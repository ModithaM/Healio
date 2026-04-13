package com.healio.patientservice.service.impl;

import com.healio.patientservice.client.UserServiceClient;
import com.healio.patientservice.dto.MedicalDocumentResponseDto;
import com.healio.patientservice.dto.PatientNameResponse;
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
import com.healio.patientservice.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PatientServiceImpl implements PatientService {

    private final PatientProfileRepository patientRepository;
    private final MedicalDocumentRepository medicalDocumentRepository;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    @Override
    public PatientProfileResponseDto createPatientProfile(PatientProfileCreateRequest request) {
        if (patientRepository.existsByUserId(request.getUserId())) {
            throw new NotFoundException("Patient profile already exists for userId: " + request.getUserId());
        }

        PatientProfile patient = modelMapper.map(request, PatientProfile.class);
        PatientProfile savedPatient = patientRepository.save(patient);

        return enrichPatientResponse(savedPatient);
    }

    @Override
    public PatientProfileResponseDto getPatientProfileByUserId(String userId) {
        PatientProfile patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient profile not found for userId: " + userId));

        return enrichPatientResponse(patient);
    }

    @Override
    public PatientProfileResponseDto getPatientProfileById(String id) {
        PatientProfile patient = patientRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Patient profile not found with id: " + id));

        return enrichPatientResponse(patient);
    }

    @Override
    public PatientProfileResponseDto updatePatientProfile(String userId, PatientProfileUpdateRequest request) {
        PatientProfile patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient profile not found for userId: " + userId));

        modelMapper.map(request, patient);
        PatientProfile updatedPatient = patientRepository.save(patient);

        return enrichPatientResponse(updatedPatient);
    }

    @Override
    public void deletePatientProfile(String userId) {
        PatientProfile patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Patient profile not found for userId: " + userId));

        patientRepository.delete(patient);
    }

    @Override
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

    @Override
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

    @Override
    public List<PatientProfileResponseDto> getAllPatients() {
        return patientRepository.findAll().stream()
                .map(this::enrichPatientResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PatientNameResponse> getPatientNames() {
        List<UserDto> patients = userServiceClient.getUsersByRole("USER").getBody();
        return (patients == null ? Collections.<UserDto>emptyList() : patients).stream()
                .map(this::toPatientNameResponse)
                .sorted(Comparator.comparing(PatientNameResponse::getFullName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private PatientNameResponse toPatientNameResponse(UserDto user) {
        return PatientNameResponse.builder()
                .id(user.getId())
                .fullName(resolveFullName(user, user.getId()))
                .build();
    }

    private String resolveFullName(UserDto user, String fallbackId) {
        if (user == null) {
            return fallbackId;
        }

        if (user.getUserDetails() != null) {
            String firstName = user.getUserDetails().getFirstName();
            String lastName = user.getUserDetails().getLastName();
            String fullName = String.join(" ",
                    firstName == null ? "" : firstName,
                    lastName == null ? "" : lastName
            ).trim();

            if (!fullName.isBlank()) {
                return fullName;
            }
        }

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            return user.getUsername();
        }

        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            return user.getEmail();
        }

        return fallbackId;
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
            }

            log.warn("Failed to fetch user info for userId: {}, status: {}", userId, response.getStatusCode());
            return null;
        } catch (Exception e) {
            log.warn("Error fetching user info from UserServiceClient for userId: {}", userId, e);
            return null;
        }
    }
}
