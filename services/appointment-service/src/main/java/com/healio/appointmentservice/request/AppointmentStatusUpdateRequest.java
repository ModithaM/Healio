package com.healio.appointmentservice.request;

import com.healio.appointmentservice.enums.AppointmentStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AppointmentStatusUpdateRequest {
    @NotNull(message = "status cannot be null")
    private AppointmentStatus status;

    private String cancelReason;
}