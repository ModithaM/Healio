package com.healio.appointmentservice.dto;

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
public class PrescriptionResponseDto {
    private String id;
    private String appointmentId;
    private String doctorId;
    private String patientId;
    private String diagnosis;
    private String notes;
    private LocalDate issuedDate;
    private List<PrescriptionItemResponseDto> items;
}