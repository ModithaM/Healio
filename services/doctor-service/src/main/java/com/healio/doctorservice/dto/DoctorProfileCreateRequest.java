package com.healio.doctorservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoctorProfileCreateRequest {

    @NotBlank(message = "userId cannot be blank")
    private String userId;

    @NotBlank(message = "specialization cannot be blank")
    private String specialization;

    @NotBlank(message = "licenseNumber cannot be blank")
    private String licenseNumber;

    private String qualifications;

    @NotNull(message = "experienceYears cannot be null")
    @Min(value = 0, message = "experienceYears must be non-negative")
    private Integer experienceYears;

    @NotNull(message = "consultationFee cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "consultationFee must be positive")
    private BigDecimal consultationFee;
}
