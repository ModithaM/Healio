package com.healio.notificationservice.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
@EnableConfigurationProperties(NotifyProperties.class)
public class NotifyConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
