package com.healio.appointmentservice.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PrescriptionItemRequest {
    @NotBlank(message = "medicineName cannot be blank")
    private String medicineName;

    @NotBlank(message = "dosage cannot be blank")
    private String dosage;

    @NotBlank(message = "frequency cannot be blank")
    private String frequency;

    private String duration;

    private String instructions;
}