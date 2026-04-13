package com.healio.patientservice.dto;

import com.healio.patientservice.enums.BloodGroup;
import com.healio.patientservice.enums.Gender;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PatientProfileUpdateRequest {

    private BloodGroup bloodGroup;

    private Gender gender;

    @PastOrPresent(message = "Date of birth must be in the past or present")
    private LocalDate dateOfBirth;

    private String emergencyContactName;

    private String emergencyContactPhone;
}
