package com.healio.authservice.client;

import com.healio.authservice.dto.LoginUserDto;
import com.healio.authservice.dto.RegisterDto;
import com.healio.authservice.dto.UserDto;
import com.healio.authservice.request.RegisterRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-service", path = "/v1/user")
public interface UserServiceClient {
    @PostMapping("/save")
    ResponseEntity<RegisterDto> save(@RequestBody RegisterRequest request);

    @GetMapping("/getUserByUsername/{username}")
    ResponseEntity<UserDto> getUserByUsername(@PathVariable String username);

    @GetMapping("/getLoginUser/{username}")
    ResponseEntity<LoginUserDto> getLoginUser(@PathVariable String username);
}
