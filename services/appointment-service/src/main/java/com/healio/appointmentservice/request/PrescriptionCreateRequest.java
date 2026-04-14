package com.healio.appointmentservice.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
public class PrescriptionCreateRequest {
    @NotBlank(message = "diagnosis cannot be blank")
    private String diagnosis;

    private String notes;

    private LocalDate issuedDate;

    @Valid
    @NotEmpty(message = "items cannot be empty")
    private List<PrescriptionItemRequest> items;
}