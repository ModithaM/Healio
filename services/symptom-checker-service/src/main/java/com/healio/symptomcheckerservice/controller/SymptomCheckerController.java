package com.healio.symptomcheckerservice.controller;

import com.healio.symptomcheckerservice.dto.SymptomAnalysisRequest;
import com.healio.symptomcheckerservice.dto.SymptomAnalysisResponse;
import com.healio.symptomcheckerservice.dto.SymptomCheckHistoryResponse;
import com.healio.symptomcheckerservice.service.SymptomCheckerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/symptom-checker")
@RequiredArgsConstructor
public class SymptomCheckerController {

    private final SymptomCheckerService symptomCheckerService;

    @PostMapping("/analyze")
    public ResponseEntity<SymptomAnalysisResponse> analyze(
            @Valid @RequestBody SymptomAnalysisRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(symptomCheckerService.analyze(request));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<SymptomCheckHistoryResponse>> getHistory(
            @PathVariable String userId) {
        return ResponseEntity.ok(symptomCheckerService.getHistory(userId));
    }
}
