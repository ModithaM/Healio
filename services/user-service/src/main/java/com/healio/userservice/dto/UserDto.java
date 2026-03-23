package com.healio.userservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.healio.userservice.model.UserDetails;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto {
    private String id;
    private String username;
    private String email;
    private UserDetails userDetails;
}
