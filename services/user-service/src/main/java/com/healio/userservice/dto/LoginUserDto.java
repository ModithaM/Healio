package com.healio.userservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.healio.userservice.model.UserDetails;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginUserDto {
    private String id;
    private String username;
    private String email;
    private String password;
    private String role;
    private UserDetails userDetails;
}
