package com.healio.telemedicineservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDetailsDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
