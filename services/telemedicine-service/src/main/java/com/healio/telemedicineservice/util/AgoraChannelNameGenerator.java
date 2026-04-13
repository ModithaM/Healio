package com.healio.telemedicineservice.util;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AgoraChannelNameGenerator {

    private static final String CHANNEL_PREFIX = "telemedicine";

    public String generate(String appointmentId) {
        return CHANNEL_PREFIX + "-" + sanitize(appointmentId) + "-" + UUID.randomUUID();
    }

    private String sanitize(String value) {
        return value == null ? "session" : value.replaceAll("[^A-Za-z0-9_-]", "-");
    }
}
