package com.healio.symptomcheckerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SymptomCheckHistoryResponse {

    private String id;
    private String userId;
    private String symptoms;
    private String additionalInfo;
    private String urgencyLevel;
    private LocalDateTime createdAt;
}
