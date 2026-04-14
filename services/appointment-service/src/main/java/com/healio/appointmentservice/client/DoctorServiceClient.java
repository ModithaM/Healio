package com.healio.appointmentservice.client;

import com.healio.appointmentservice.config.FeignConfig;
import com.healio.appointmentservice.dto.DoctorProfileResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "doctor-service", path = "/v1/doctor-service", configuration = FeignConfig.class)
public interface DoctorServiceClient {
    @GetMapping("/getDoctorByUserId/{userId}")
    ResponseEntity<DoctorProfileResponseDto> getDoctorByUserId(@PathVariable String userId);
}