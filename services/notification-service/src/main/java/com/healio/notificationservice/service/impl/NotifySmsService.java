package com.healio.notificationservice.service.impl;

import com.healio.notificationservice.config.NotifyProperties;
import com.healio.notificationservice.exception.InvalidPhoneNumberException;
import com.healio.notificationservice.exception.SmsDeliveryException;
import com.healio.notificationservice.service.SmsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotifySmsService implements SmsService {
    private static final String NOTIFY_LK_SMS_ENDPOINT = "https://app.notify.lk/api/v1/send";
    private static final Pattern NOTIFY_NUMBER_PATTERN = Pattern.compile("^\\+?94\\d{9}$");
    private static final DateTimeFormatter SMS_TIME_FORMATTER = DateTimeFormatter.ofPattern("MMM d, yyyy 'at' h:mm a");

    private final NotifyProperties notifyProperties;
    private final RestTemplate restTemplate;

    @Override
    public void sendSessionReminder(String phoneNumber, String title, LocalDateTime scheduledTime) {
        validateSmsRequest(phoneNumber, title, scheduledTime);

        if (!hasCredentials()) {
            throw new SmsDeliveryException("Notify.lk credentials are not configured");
        }

        String normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
        String message = buildSmsMessage(title, scheduledTime);
        String requestUrl = UriComponentsBuilder.fromHttpUrl(NOTIFY_LK_SMS_ENDPOINT)
                .queryParam("user_id", notifyProperties.getUserId())
                .queryParam("api_key", notifyProperties.getApiKey())
                .queryParam("sender_id", notifyProperties.getSenderId())
                .queryParam("to", normalizedPhoneNumber)
                .queryParam("message", message)
                .toUriString();

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(requestUrl, String.class);
            log.info("SMS sent via Notify.lk to {}. status={}, response={}",
                    normalizedPhoneNumber, response.getStatusCode().value(), response.getBody());
        } catch (RestClientException exception) {
            log.warn("Notify.lk SMS send failed for {}", normalizedPhoneNumber, exception);
            throw new SmsDeliveryException("Notify.lk API failure: " + exception.getMessage(), exception);
        }
    }

    private void validateSmsRequest(String phoneNumber, String title, LocalDateTime scheduledTime) {
        String normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
        if (!StringUtils.hasText(normalizedPhoneNumber) || !NOTIFY_NUMBER_PATTERN.matcher(normalizedPhoneNumber).matches()) {
            throw new InvalidPhoneNumberException("Phone number must be in Sri Lankan international format like 94767892645 or +94767892645");
        }
        if (!StringUtils.hasText(title)) {
            throw new IllegalArgumentException("Session title is required");
        }
        if (scheduledTime == null) {
            throw new IllegalArgumentException("Scheduled time is required");
        }
    }

    private boolean hasCredentials() {
        return StringUtils.hasText(notifyProperties.getUserId())
                && StringUtils.hasText(notifyProperties.getApiKey())
                && StringUtils.hasText(notifyProperties.getSenderId());
    }

    private String normalizePhoneNumber(String phoneNumber) {
        if (!StringUtils.hasText(phoneNumber)) {
            return null;
        }

        String normalized = phoneNumber.replaceAll("[\\s-]", "");
        if (normalized.matches("^\\+94\\d{9}$")) {
            return normalized;
        }
        if (normalized.matches("^94\\d{9}$")) {
            return normalized;
        }
        if (normalized.matches("^0\\d{9}$")) {
            return "94" + normalized.substring(1);
        }
        return normalized;
    }

    private String buildSmsMessage(String title, LocalDateTime scheduledTime) {
        String cleanedTitle = title.trim().replaceAll("\\s+", " ");
        String formattedTime = scheduledTime.format(SMS_TIME_FORMATTER);

        return """
                Healio Telemedicine
                Session Confirmed

                Title: %s
                Time: %s

                Please be ready to join 5 minutes early.
                """
                .formatted(cleanedTitle, formattedTime)
                .trim();
    }
}
