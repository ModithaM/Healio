package com.healio.telemedicineservice.client;

import com.healio.telemedicineservice.dto.PatientProfileResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "patient-service", path = "/v1/patient-service")
public interface PatientServiceClient {

    @GetMapping("/getPatientByUserId/{userId}")
    ResponseEntity<PatientProfileResponseDto> getPatientProfileByUserId(@PathVariable String userId);
}
