package com.healio.doctorservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
public class DoctorProfileUpdateRequest {

    private String specialization;

    private String qualifications;

    @Min(value = 0, message = "experienceYears must be non-negative")
    private Integer experienceYears;

    @DecimalMin(value = "0.0", inclusive = false, message = "consultationFee must be positive")
    private BigDecimal consultationFee;
}
