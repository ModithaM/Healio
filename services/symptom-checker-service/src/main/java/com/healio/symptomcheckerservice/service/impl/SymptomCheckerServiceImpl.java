package com.healio.symptomcheckerservice.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healio.symptomcheckerservice.anthropic.AnthropicService;
import com.healio.symptomcheckerservice.dto.SymptomAnalysisRequest;
import com.healio.symptomcheckerservice.dto.SymptomAnalysisResponse;
import com.healio.symptomcheckerservice.dto.SymptomCheckHistoryResponse;
import com.healio.symptomcheckerservice.entity.SymptomCheck;
import com.healio.symptomcheckerservice.repository.SymptomCheckRepository;
import com.healio.symptomcheckerservice.service.SymptomCheckerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SymptomCheckerServiceImpl implements SymptomCheckerService {

    private final AnthropicService anthropicService;
    private final SymptomCheckRepository repository;
    private final ObjectMapper objectMapper;

    @Override
    public SymptomAnalysisResponse analyze(SymptomAnalysisRequest request) {
        SymptomAnalysisResponse analysis = anthropicService.analyze(
                request.getSymptoms(),
                request.getAdditionalInfo(),
                request.getPatientAge(),
                request.getPatientGender()
        );

        String analysisJson;
        try {
            analysisJson = objectMapper.writeValueAsString(analysis);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize analysis result: {}", e.getMessage());
            analysisJson = "{}";
        }

        SymptomCheck check = SymptomCheck.builder()
                .userId(request.getUserId())
                .symptoms(request.getSymptoms())
                .additionalInfo(request.getAdditionalInfo())
                .urgencyLevel(analysis.getUrgencyLevel())
                .analysisResult(analysisJson)
                .build();

        SymptomCheck saved = repository.save(check);

        analysis.setCheckId(saved.getId());
        analysis.setUserId(request.getUserId());
        analysis.setAnalyzedAt(saved.getCreatedAt());
        return analysis;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SymptomCheckHistoryResponse> getHistory(String userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(check -> SymptomCheckHistoryResponse.builder()
                        .id(check.getId())
                        .userId(check.getUserId())
                        .symptoms(check.getSymptoms())
                        .additionalInfo(check.getAdditionalInfo())
                        .urgencyLevel(check.getUrgencyLevel())
                        .createdAt(check.getCreatedAt())
                        .build())
                .toList();
    }
}
