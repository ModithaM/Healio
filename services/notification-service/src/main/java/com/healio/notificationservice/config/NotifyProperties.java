package com.healio.notificationservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "notify")
public class NotifyProperties {

    private String userId;
    private String apiKey;
    private String senderId;
}
