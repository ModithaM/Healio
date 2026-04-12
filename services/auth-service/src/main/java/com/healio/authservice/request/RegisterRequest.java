package com.healio.authservice.request;

import lombok.Getter;

@Getter
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
}
