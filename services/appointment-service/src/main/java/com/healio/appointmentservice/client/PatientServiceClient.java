package com.healio.appointmentservice.client;

import com.healio.appointmentservice.config.FeignConfig;
import com.healio.appointmentservice.dto.PatientProfileResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "patient-service", path = "/v1/patient-service", configuration = FeignConfig.class)
public interface PatientServiceClient {
    @GetMapping("/getPatientByUserId/{userId}")
    ResponseEntity<PatientProfileResponseDto> getPatientByUserId(@PathVariable String userId);
}