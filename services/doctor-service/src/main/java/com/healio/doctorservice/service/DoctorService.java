package com.healio.doctorservice.service;

import com.healio.doctorservice.client.UserServiceClient;
import com.healio.doctorservice.dto.*;
import com.healio.doctorservice.enums.VerificationStatus;
import com.healio.doctorservice.exc.NotFoundException;
import com.healio.doctorservice.exc.UnauthorizedException;
import com.healio.doctorservice.model.DoctorAvailability;
import com.healio.doctorservice.model.DoctorProfile;
import com.healio.doctorservice.repository.DoctorAvailabilityRepository;
import com.healio.doctorservice.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorProfileRepository doctorRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    // Doctor Profile CRUD
    public DoctorProfileResponseDto createDoctorProfile(DoctorProfileCreateRequest request) {
        if (doctorRepository.existsByUserId(request.getUserId())) {
            throw new NotFoundException("Doctor profile already exists for userId: " + request.getUserId());
        }
        if (doctorRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new NotFoundException("License number already registered: " + request.getLicenseNumber());
        }

        DoctorProfile doctor = modelMapper.map(request, DoctorProfile.class);
        doctor.setVerificationStatus(VerificationStatus.PENDING);
        DoctorProfile savedDoctor = doctorRepository.save(doctor);

        return enrichDoctorResponse(savedDoctor);
    }

    public DoctorProfileResponseDto getDoctorProfileById(String id) {
        DoctorProfile doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Doctor profile not found with id: " + id));
        return enrichDoctorResponse(doctor);
    }

    //private Helpers
    private DoctorProfileResponseDto enrichDoctorResponse(DoctorProfile doctor) {
        DoctorProfileResponseDto dto = modelMapper.map(doctor, DoctorProfileResponseDto.class);

        if (doctor.getAvailabilitySlots() != null) {
            List<DoctorAvailabilityResponseDto> slots = doctor.getAvailabilitySlots().stream()
                    .map(slot -> modelMapper.map(slot, DoctorAvailabilityResponseDto.class))
                    .collect(Collectors.toList());
            dto.setAvailabilitySlots(slots);
        }

        dto.setUserInfo(fetchUserInfo(doctor.getUserId()));
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
