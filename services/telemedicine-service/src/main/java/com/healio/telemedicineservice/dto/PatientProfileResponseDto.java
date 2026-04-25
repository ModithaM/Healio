package com.healio.telemedicineservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PatientProfileResponseDto {

    private String id;
    private String userId;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
