package com.healio.authservice.service;

import com.healio.authservice.client.UserServiceClient;
import com.healio.authservice.dto.LoginResponseDto;
import com.healio.authservice.dto.LoginUserDto;
import com.healio.authservice.dto.RegisterDto;
import com.healio.authservice.exc.WrongCredentialsException;
import com.healio.authservice.request.LoginRequest;
import com.healio.authservice.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserServiceClient userServiceClient;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDto login(LoginRequest request) {
        ResponseEntity<LoginUserDto> userResponse = userServiceClient.getLoginUser(request.getUsername());
        LoginUserDto userDto = userResponse.getBody();

        if (userDto == null || !passwordEncoder.matches(request.getPassword(), userDto.getPassword())) {
            throw new WrongCredentialsException("Bad credentials");
        }

        String token = jwtService.generateToken(request.getUsername());

        return LoginResponseDto.builder()
                .token(token)
                .userId(userDto.getId())
                .username(userDto.getUsername())
                .email(userDto.getEmail())
                .firstName(userDto.getUserDetails() != null ? userDto.getUserDetails().getFirstName() : null)
                .lastName(userDto.getUserDetails() != null ? userDto.getUserDetails().getLastName() : null)
                .role(userDto.getRole())
                .build();
    }

    public RegisterDto register(RegisterRequest request) {
        return userServiceClient.save(request).getBody();
    }
}
