package com.healio.symptomcheckerservice.service;

import com.healio.symptomcheckerservice.dto.SymptomAnalysisRequest;
import com.healio.symptomcheckerservice.dto.SymptomAnalysisResponse;
import com.healio.symptomcheckerservice.dto.SymptomCheckHistoryResponse;

import java.util.List;

public interface SymptomCheckerService {

    SymptomAnalysisResponse analyze(SymptomAnalysisRequest request);

    List<SymptomCheckHistoryResponse> getHistory(String userId);
}
