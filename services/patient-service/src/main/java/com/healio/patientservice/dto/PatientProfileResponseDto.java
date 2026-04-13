package com.healio.patientservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PatientProfileResponseDto {

    private String id;

    private String userId;

    private String bloodGroup;

    private String gender;

    private LocalDate dateOfBirth;

    private String emergencyContactName;

    private String emergencyContactPhone;

    private List<MedicalDocumentResponseDto> medicalDocuments;

    private UserDto userInfo;
}
