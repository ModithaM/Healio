package com.healio.patientservice.client;

import com.healio.patientservice.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "user-service", path = "/v1/user")
public interface UserServiceClient {
    @GetMapping("/getUserById/{id}")
    ResponseEntity<UserDto> getUserById(@PathVariable String id);

    @GetMapping("/getUsersByRole/{role}")
    ResponseEntity<List<UserDto>> getUsersByRole(@PathVariable String role);
}
