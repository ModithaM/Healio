package com.healio.doctorservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DoctorAvailabilityRequest {

    @NotNull(message = "dayOfWeek cannot be null")
    private DayOfWeek dayOfWeek;

    @NotNull(message = "startTime cannot be null")
    private LocalTime startTime;

    @NotNull(message = "endTime cannot be null")
    private LocalTime endTime;

    private Boolean isActive = true;
}
