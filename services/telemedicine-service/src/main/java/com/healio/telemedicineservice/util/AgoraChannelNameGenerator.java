package com.healio.telemedicineservice.util;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class AgoraChannelNameGenerator {

    private static final String CHANNEL_PREFIX = "tm";
    private static final int MAX_CHANNEL_NAME_BYTES = 64;
    private static final int APPOINTMENT_SEGMENT_LENGTH = 18;
    private static final int RANDOM_SEGMENT_LENGTH = 24;

    public String generate(String appointmentId) {
        String appointmentSegment = truncate(sanitize(appointmentId), APPOINTMENT_SEGMENT_LENGTH);
        String randomSegment = UUID.randomUUID().toString().replace("-", "").substring(0, RANDOM_SEGMENT_LENGTH);
        return truncate(CHANNEL_PREFIX + "-" + appointmentSegment + "-" + randomSegment, MAX_CHANNEL_NAME_BYTES);
    }

    public boolean isValid(String channelName) {
        return channelName != null
                && !channelName.isBlank()
                && channelName.getBytes().length <= MAX_CHANNEL_NAME_BYTES
                && channelName.matches("[A-Za-z0-9 !#$%&()+\\-:;<=>?@\\[\\]^_{}|~,.]+");
    }

    private String sanitize(String value) {
        return value == null ? "session" : value.replaceAll("[^A-Za-z0-9_-]", "-");
    }

    private String truncate(String value, int maxLength) {
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }
}
