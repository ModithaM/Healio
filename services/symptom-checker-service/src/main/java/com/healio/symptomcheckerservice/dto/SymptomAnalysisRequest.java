package com.healio.symptomcheckerservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SymptomAnalysisRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Symptoms description is required")
    @Size(min = 10, max = 2000, message = "Symptoms must be between 10 and 2000 characters")
    private String symptoms;

    @Size(max = 1000, message = "Additional info must be under 1000 characters")
    private String additionalInfo;

    private Integer patientAge;

    private String patientGender;
}
