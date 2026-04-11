package com.healio.authservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginUserDetailsDto {
    private String firstName;
    private String lastName;
}
