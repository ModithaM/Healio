package com.healio.symptomcheckerservice.exc;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class GenericErrorResponse {
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
}
