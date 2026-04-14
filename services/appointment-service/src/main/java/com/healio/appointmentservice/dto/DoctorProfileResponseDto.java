package com.healio.appointmentservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoctorProfileResponseDto {
    private String id;
    private String userId;
    private String specialization;
    private String licenseNumber;
    private String qualifications;
    private Integer experienceYears;
    private BigDecimal consultationFee;
    private String verificationStatus;
    private List<DoctorAvailabilityResponseDto> availabilitySlots;
    private UserDto userInfo;
}