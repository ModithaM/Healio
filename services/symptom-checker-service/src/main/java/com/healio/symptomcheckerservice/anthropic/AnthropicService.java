package com.healio.symptomcheckerservice.anthropic;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.healio.symptomcheckerservice.dto.SymptomAnalysisResponse;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * AI analysis service backed by Google Gemini (free tier).
 * Get a free API key at <a href="https://aistudio.google.com/app/apikey">...</a>
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AnthropicService {

    private final RestClient geminiRestClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Value("${gemini.max-tokens}")
    private int maxTokens;

    @PostConstruct
    void validateConfig() {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("═══════════════════════════════════════════════════════════");
            log.warn("  GEMINI_API_KEY is not set in your .env file.");
            log.warn("  The symptom checker will return fallback responses.");
            log.warn("  Get a free key at: https://aistudio.google.com/app/apikey");
            log.warn("  Then add:  GEMINI_API_KEY=your_key  to your .env file.");
            log.warn("═══════════════════════════════════════════════════════════");
        } else {
            log.info("Gemini AI symptom checker ready (model: {})", model);
        }
    }

    private static final String SYSTEM_PROMPT = """
            You are a medical triage assistant. Analyze the patient's reported symptoms and respond ONLY with a valid JSON object matching this exact structure — no prose, no markdown, no code fences:
            {
              "possibleConditions": ["condition1", "condition2", "condition3"],
              "urgencyLevel": "ROUTINE",
              "recommendedSpecialties": ["Specialty1", "Specialty2"],
              "generalAdvice": "Brief practical health advice based on the symptoms.",
              "disclaimer": "This is a preliminary AI-generated assessment and not a medical diagnosis. Please consult a qualified healthcare professional for proper evaluation and treatment."
            }

            Rules:
            - urgencyLevel must be exactly one of: ROUTINE, SOON, URGENT, EMERGENCY
              - ROUTINE: Non-acute symptoms, schedule a regular appointment within weeks
              - SOON: Concerning symptoms, see a doctor within 2-3 days
              - URGENT: Potentially serious, see a doctor within 24 hours
              - EMERGENCY: Seek immediate emergency care
            - possibleConditions: list 2-4 plausible conditions (not definitive diagnoses)
            - recommendedSpecialties: list 1-3 relevant medical specialties (e.g., General Practitioner, Cardiologist, Neurologist, Pulmonologist, Orthopedist, Dermatologist, Gastroenterologist, ENT Specialist, Psychiatrist, Endocrinologist)
            - generalAdvice: 1-2 sentences of practical, safe guidance
            - Output must be a single JSON object only — no other text
            """;

    public SymptomAnalysisResponse analyze(String symptoms, String additionalInfo, Integer age, String gender) {
        String userMessage = buildUserMessage(symptoms, additionalInfo, age, gender);

        // Gemini request body
        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", SYSTEM_PROMPT))
                ),
                "contents", List.of(
                        Map.of("role", "user", "parts", List.of(Map.of("text", userMessage)))
                ),
                "generationConfig", Map.of(
                        "maxOutputTokens", maxTokens,
                        "temperature", 0.2
                )
        );

        try {
            String responseBody = geminiRestClient.post()
                    .uri("/v1beta/models/{model}:generateContent?key={key}", model, apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(String.class);

            return parseGeminiResponse(responseBody, symptoms);
        } catch (Exception e) {
            log.error("Gemini API call failed: {}", e.getMessage());
            return buildFallbackResponse(symptoms);
        }
    }

    private String buildUserMessage(String symptoms, String additionalInfo, Integer age, String gender) {
        StringBuilder sb = new StringBuilder();
        sb.append("Patient symptoms: ").append(symptoms);
        if (age != null) {
            sb.append("\nPatient age: ").append(age).append(" years");
        }
        if (gender != null && !gender.isBlank()) {
            sb.append("\nPatient gender: ").append(gender);
        }
        if (additionalInfo != null && !additionalInfo.isBlank()) {
            sb.append("\nAdditional information: ").append(additionalInfo);
        }
        return sb.toString();
    }

    private SymptomAnalysisResponse parseGeminiResponse(String responseBody, String symptoms) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            // Gemini response: candidates[0].content.parts[0].text
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            // Strip any accidental markdown fences
            text = text.strip();
            if (text.startsWith("```")) {
                text = text.replaceAll("^```[a-z]*\\n?", "").replaceAll("```$", "").strip();
            }

            JsonNode analysis = objectMapper.readTree(text);

            List<String> conditions = new ArrayList<>();
            analysis.path("possibleConditions").forEach(node -> conditions.add(node.asText()));

            List<String> specialties = new ArrayList<>();
            analysis.path("recommendedSpecialties").forEach(node -> specialties.add(node.asText()));

            return SymptomAnalysisResponse.builder()
                    .symptoms(symptoms)
                    .possibleConditions(conditions)
                    .urgencyLevel(analysis.path("urgencyLevel").asText("ROUTINE"))
                    .recommendedSpecialties(specialties)
                    .generalAdvice(analysis.path("generalAdvice").asText())
                    .disclaimer(analysis.path("disclaimer").asText())
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            return buildFallbackResponse(symptoms);
        }
    }

    private SymptomAnalysisResponse buildFallbackResponse(String symptoms) {
        return SymptomAnalysisResponse.builder()
                .symptoms(symptoms)
                .possibleConditions(List.of("Unable to analyze at this time"))
                .urgencyLevel("ROUTINE")
                .recommendedSpecialties(List.of("General Practitioner"))
                .generalAdvice("We were unable to complete the AI analysis. Please consult a General Practitioner for a proper evaluation.")
                .disclaimer("This is a preliminary AI-generated assessment and not a medical diagnosis. Please consult a qualified healthcare professional.")
                .build();
    }
}
