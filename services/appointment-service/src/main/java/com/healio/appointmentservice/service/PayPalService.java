package com.healio.appointmentservice.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.healio.appointmentservice.exc.GenericErrorResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PayPalService {

    private final RestTemplate restTemplate;

    @Value("${paypal.base-url:https://api-m.sandbox.paypal.com}")
    private String paypalBaseUrl;

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    public record PayPalOrderData(String orderId, String status, String approveUrl) {}
    public record PayPalCaptureData(String orderId, String status, String captureId) {}

    public PayPalOrderData createOrder(String appointmentId, BigDecimal amount, String currency) {
        String accessToken = getAccessToken();
        String url = paypalBaseUrl + "/v2/checkout/orders";

        Map<String, Object> payload = Map.of(
                "intent", "CAPTURE",
                "purchase_units", List.of(
                        Map.of(
                                "custom_id", appointmentId,
                                "description", "Healio appointment payment",
                                "amount", Map.of(
                                        "currency_code", currency,
                                        "value", amount.toPlainString()
                                )
                        )
                ),
                "application_context", Map.of(
                        "shipping_preference", "NO_SHIPPING"
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(payload, headers),
                    JsonNode.class
            );

            JsonNode body = requireBody(response.getBody(), "Failed to create PayPal order");
            String orderId = requireText(body, "id", "Failed to read PayPal order ID");
            String status = requireText(body, "status", "Failed to read PayPal order status");
            String approveUrl = null;
            JsonNode links = body.path("links");
            if (links.isArray()) {
                for (JsonNode link : links) {
                    if ("approve".equalsIgnoreCase(link.path("rel").asText())) {
                        approveUrl = link.path("href").asText(null);
                        break;
                    }
                }
            }
            if (approveUrl == null || approveUrl.isBlank()) {
                throw new GenericErrorResponse("PayPal approval URL is missing", HttpStatus.BAD_GATEWAY);
            }

            return new PayPalOrderData(orderId, status, approveUrl);
        } catch (RestClientException exception) {
            throw new GenericErrorResponse("Failed to create PayPal order", HttpStatus.BAD_GATEWAY);
        }
    }

    public PayPalCaptureData captureOrder(String orderId) {
        String accessToken = getAccessToken();
        String url = paypalBaseUrl + "/v2/checkout/orders/" + orderId + "/capture";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(accessToken);

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(Map.of(), headers),
                    JsonNode.class
            );

            JsonNode body = requireBody(response.getBody(), "Failed to capture PayPal order");
            String status = requireText(body, "status", "Failed to read PayPal capture status");
            String captureId = body.path("purchase_units").isArray() && body.path("purchase_units").size() > 0
                    ? body.path("purchase_units").get(0).path("payments").path("captures").isArray()
                        && body.path("purchase_units").get(0).path("payments").path("captures").size() > 0
                            ? body.path("purchase_units").get(0).path("payments").path("captures").get(0).path("id").asText(null)
                            : null
                    : null;

            return new PayPalCaptureData(orderId, status, captureId);
        } catch (RestClientException exception) {
            throw new GenericErrorResponse("Failed to capture PayPal payment", HttpStatus.BAD_GATEWAY);
        }
    }

    private String getAccessToken() {
        String auth = Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes());
        String url = paypalBaseUrl + "/v1/oauth2/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Basic " + auth);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");

        try {
            ResponseEntity<JsonNode> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    JsonNode.class
            );

            JsonNode responseBody = requireBody(response.getBody(), "Failed to authenticate with PayPal");
            return requireText(responseBody, "access_token", "PayPal access token is missing");
        } catch (RestClientException exception) {
            throw new GenericErrorResponse("Failed to authenticate with PayPal", HttpStatus.BAD_GATEWAY);
        }
    }

    private JsonNode requireBody(JsonNode body, String message) {
        if (body == null || body.isNull()) {
            throw new GenericErrorResponse(message, HttpStatus.BAD_GATEWAY);
        }
        return body;
    }

    private String requireText(JsonNode node, String field, String message) {
        String value = node.path(field).asText(null);
        if (value == null || value.isBlank()) {
            throw new GenericErrorResponse(message, HttpStatus.BAD_GATEWAY);
        }
        return value;
    }
}
