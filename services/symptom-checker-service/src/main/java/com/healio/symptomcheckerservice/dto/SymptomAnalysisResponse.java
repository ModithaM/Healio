package com.healio.symptomcheckerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SymptomAnalysisResponse {

    private String checkId;
    private String userId;
    private String symptoms;
    private List<String> possibleConditions;
    private String urgencyLevel;
    private List<String> recommendedSpecialties;
    private String generalAdvice;
    private String disclaimer;
    private LocalDateTime analyzedAt;
}
